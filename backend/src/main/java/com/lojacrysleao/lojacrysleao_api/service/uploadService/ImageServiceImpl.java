package com.lojacrysleao.lojacrysleao_api.service.uploadService;

import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );

    // Diretório onde serão armazenadas as imagens dos produtos
    // Em container (WORKDIR=/app) usamos /app/uploads/products (volume compartilhado)
    // Localmente, usa <projectRoot>/uploads/products (projectRoot = pasta 'loja')
    public static final String UPLOAD_DIR = resolveUploadDir();

    private static String resolveUploadDir() {
        String baseEnv = System.getenv("UPLOAD_BASE_DIR");
        if (baseEnv != null && !baseEnv.isBlank()) {
            return Paths.get(baseEnv, "products").toString();
        }

        String userDir = System.getProperty("user.dir", ".");
        // Dentro do container (WORKDIR=/app)
        if ("/app".equals(userDir)) {
            return Paths.get("/app", "uploads", "products").toString();
        }

    // Fora do container: queremos <projectRoot>/uploads/products
        // Se estiver rodando a partir de 'backend', subimos um nível para 'loja'
        Path userPath = Paths.get(userDir).toAbsolutePath().normalize();
        Path projectRoot = userPath;
        if (userPath.getFileName() != null && "backend".equals(userPath.getFileName().toString())) {
            projectRoot = userPath.getParent() != null ? userPath.getParent() : userPath;
        }
    return projectRoot.resolve(Paths.get("uploads", "products")).toString();
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new BadRequestException("O arquivo está vazio");
            }

            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
                throw new ValidationException("Tipo de arquivo inválido: " + contentType);
            }

            String extension = contentType.substring(contentType.indexOf('/') + 1);
            if ("jpeg".equalsIgnoreCase(extension)) extension = "jpg";
            String filename = UUID.randomUUID().toString() + "." + extension;

            // Garante que o diretório de upload exista
            Path uploadDirPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadDirPath);

            File outputFile = uploadDirPath.resolve(filename).toFile();

            try {
                Thumbnails.of(file.getInputStream())
                        .size(800, 800)
                        .outputFormat(extension)
                        .toFile(outputFile);
            } catch (IOException | RuntimeException thumbEx) {
                // Fallback: salva arquivo original sem redimensionar (ex.: WEBP sem writer)
                try {
                    Files.copy(file.getInputStream(), outputFile.toPath());
                } catch (IOException ioEx) {
                    throw new BadRequestException("Falha ao salvar a imagem: " + ioEx.getMessage());
                }
            }

            return filename;
        } catch (BadRequestException | ValidationException e) {
            throw e; // Re-throw custom exceptions
        } catch (IOException e) {
            throw new BadRequestException("Não foi possível processar a imagem: " + e.getMessage());
        }
    }
}

