package com.lojacrysleao.lojacrysleao_api.service.uploadService;

import com.lojacrysleao.lojacrysleao_api.exception.BadRequestException;
import com.lojacrysleao.lojacrysleao_api.exception.ValidationException;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private static final String UPLOAD_DIR;

    static {
        // Descobre o caminho base do projeto (pasta "loja")
        String baseDir = System.getProperty("user.dir");

        // Monta o caminho da pasta de uploads
        UPLOAD_DIR = Paths.get(baseDir, "backend", "uploads", "products").toString();

        // Garante que a pasta existe
        File uploadDirFile = new File(UPLOAD_DIR);
        if (!uploadDirFile.exists()) {
            boolean created = uploadDirFile.mkdirs();
            if (created) {
                System.out.println("Pasta criada: " + UPLOAD_DIR);
            } else {
                System.err.println("Não foi possível criar a pasta de upload: " + UPLOAD_DIR);
            }
        }
    }

    public String getUploadDir() {
        return UPLOAD_DIR;
    }

    @Override
    public String uploadImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new BadRequestException("O arquivo está vazio");
            }

            String contentType = file.getContentType();
            if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
                throw new ValidationException("Tipo de arquivo inválido: " + contentType);
            }

            String extension = contentType.substring(contentType.indexOf("/") + 1);
            String filename = UUID.randomUUID().toString() + "." + extension;

            File outputFile = new File(UPLOAD_DIR + File.separator + filename);

            Thumbnails.of(file.getInputStream())
                    .size(800, 800) // largura e altura
                    .outputFormat(extension) // força salvar como o mesmo tipo (jpg, png, webp)
                    .toFile(outputFile);

            return filename;
        } catch (BadRequestException | ValidationException e) {
            throw e; // Re-throw custom exceptions
        } catch (Exception e) {
            throw new BadRequestException("Não foi possível processar a imagem: " + e.getMessage());
        }
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        Image resultingImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage outputImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        outputImage.getGraphics().drawImage(resultingImage, 0, 0, null);
        return outputImage;
    }
}

