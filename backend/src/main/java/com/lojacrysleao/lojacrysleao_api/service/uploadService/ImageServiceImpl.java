package com.lojacrysleao.lojacrysleao_api.service.uploadService;

import net.coobird.thumbnailator.Thumbnails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.List;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp"
    );

    public static final String UPLOAD_DIR = "/home/hlxt/loja-gitlab/loja/backend/uploads"; // Diretório local para desenvolvimento

    @Override
    public String uploadImage(MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("O arquivo está vazio");
        }

        String contentType = file.getContentType();
        if (!ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Tipo de arquivo inválido: " + contentType);
        }

        String extension = contentType.substring(contentType.indexOf("/") + 1);
        String filename = UUID.randomUUID().toString() + "." + extension;

        File outputFile = new File(UPLOAD_DIR + File.separator + filename);

        Thumbnails.of(file.getInputStream())
                .size(800, 800) // largura e altura
                .outputFormat(extension) // força salvar como o mesmo tipo (jpg, png, webp)
                .toFile(outputFile);

        return filename;
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        Image resultingImage = originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH);
        BufferedImage outputImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        outputImage.getGraphics().drawImage(resultingImage, 0, 0, null);
        return outputImage;
    }
}

