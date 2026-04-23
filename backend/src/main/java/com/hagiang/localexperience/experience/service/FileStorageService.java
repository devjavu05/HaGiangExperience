package com.hagiang.localexperience.experience.service;

import com.hagiang.localexperience.common.config.UploadProperties;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadRootPath;

    public FileStorageService(UploadProperties uploadProperties) {
        this.uploadRootPath = Paths.get(uploadProperties.getDir()).toAbsolutePath().normalize();
    }

    public List<String> storeFiles(List<MultipartFile> files) {
        try {
            Files.createDirectories(uploadRootPath);
            List<String> storedUrls = new ArrayList<>();

            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) {
                    continue;
                }

                String storedFileName = generateFileName(file);
                Path targetPath = uploadRootPath.resolve(storedFileName).normalize();

                if (!targetPath.startsWith(uploadRootPath)) {
                    throw new IllegalArgumentException("Invalid image file name");
                }

                try (InputStream inputStream = file.getInputStream()) {
                    Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING);
                }

                storedUrls.add("/uploads/" + storedFileName);
            }

            return storedUrls;
        } catch (IOException ex) {
            throw new IllegalArgumentException("Unable to store image files");
        }
    }

    public void deleteFiles(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (String imageUrl : imageUrls) {
            if (!StringUtils.hasText(imageUrl)) {
                continue;
            }

            String fileName = imageUrl.replace("/uploads/", "");
            Path targetPath = uploadRootPath.resolve(fileName).normalize();
            if (!targetPath.startsWith(uploadRootPath)) {
                continue;
            }

            try {
                Files.deleteIfExists(targetPath);
            } catch (IOException ex) {
                throw new IllegalArgumentException("Unable to delete image file: " + imageUrl);
            }
        }
    }

    private String generateFileName(MultipartFile file) {
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        if (!StringUtils.hasText(originalFileName)) {
            throw new IllegalArgumentException("Invalid image file name");
        }

        String sanitizedFileName = originalFileName
                .replace("..", "")
                .replace("\\", "_")
                .replace("/", "_")
                .replace(" ", "_");

        return UUID.randomUUID() + "_" + sanitizedFileName;
    }
}
