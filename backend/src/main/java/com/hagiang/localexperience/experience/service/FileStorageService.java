package com.hagiang.localexperience.experience.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hagiang.localexperience.common.config.CloudinaryProperties;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final String DEFAULT_FOLDER = "ha-giang-local-experience";

    private final CloudinaryProperties cloudinaryProperties;
    private final Cloudinary cloudinary;

    public FileStorageService(CloudinaryProperties cloudinaryProperties) {
        this.cloudinaryProperties = cloudinaryProperties;
        this.cloudinary = cloudinaryProperties.isConfigured()
                ? new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", cloudinaryProperties.getCloudName(),
                        "api_key", cloudinaryProperties.getApiKey(),
                        "api_secret", cloudinaryProperties.getApiSecret(),
                        "secure", true
                ))
                : null;
    }

    public List<String> storeFiles(List<MultipartFile> files) {
        ensureConfigured();

        List<String> storedUrls = new ArrayList<>();

        try {
            for (MultipartFile file : files) {
                if (file == null || file.isEmpty()) {
                    continue;
                }

                if (!isImage(file)) {
                    throw new IllegalArgumentException("Only image files are supported");
                }

                Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", resolveFolder(),
                                "public_id", generateFileName(file),
                                "resource_type", "image"
                        )
                );

                Object secureUrl = uploadResult.get("secure_url");
                if (secureUrl instanceof String url && StringUtils.hasText(url)) {
                    storedUrls.add(url);
                }
            }

            return storedUrls;
        } catch (IOException ex) {
            throw new IllegalArgumentException("Unable to store image files", ex);
        }
    }

    public void deleteFiles(List<String> imageUrls) {
        ensureConfigured();

        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        for (String imageUrl : imageUrls) {
            if (!StringUtils.hasText(imageUrl)) {
                continue;
            }

            String publicId = extractPublicId(imageUrl);
            if (!StringUtils.hasText(publicId)) {
                continue;
            }

            try {
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
            } catch (IOException ex) {
                throw new IllegalArgumentException("Unable to delete image file: " + imageUrl, ex);
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

    private void ensureConfigured() {
        if (!cloudinaryProperties.isConfigured() || cloudinary == null) {
            throw new IllegalStateException("Cloudinary is not configured");
        }
    }

    private boolean isImage(MultipartFile file) {
        return file.getContentType() != null && file.getContentType().toLowerCase().startsWith("image/");
    }

    private String resolveFolder() {
        return StringUtils.hasText(cloudinaryProperties.getFolder())
                ? cloudinaryProperties.getFolder().trim()
                : DEFAULT_FOLDER;
    }

    private String extractPublicId(String imageUrl) {
        if (!StringUtils.hasText(imageUrl) || !imageUrl.contains("/upload/")) {
            return null;
        }

        String afterUpload = imageUrl.substring(imageUrl.indexOf("/upload/") + "/upload/".length());
        afterUpload = afterUpload.replaceFirst("^v\\d+/", "");

        int extensionIndex = afterUpload.lastIndexOf('.');
        if (extensionIndex <= 0) {
            return afterUpload;
        }

        return afterUpload.substring(0, extensionIndex);
    }
}
