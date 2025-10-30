package com.example.backend_kovarna.application.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/webp"
    );
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".jpg", ".jpeg", ".png", ".webp"
    );

    @Value("${file.upload.dir:uploads/events}")
    private String uploadDir;

    /**
     * Store uploaded file with validation
     */
    public String storeFile(MultipartFile file, Long eventId) throws IOException {
        // Validate file
        validateFile(file);

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Sanitize and generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = String.format("event_%d_%s%s",
                eventId,
                UUID.randomUUID().toString(),
                extension);

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    /**
     * Delete file from storage
     */
    public void deleteFile(String filename) throws IOException {
        if (filename == null || filename.isEmpty()) {
            return;
        }

        Path filePath = Paths.get(uploadDir).resolve(filename);
        Files.deleteIfExists(filePath);
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("File size exceeds maximum limit of %d MB", MAX_FILE_SIZE / (1024 * 1024))
            );
        }

        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException(
                    "Invalid file type. Only JPG, PNG, and WEBP images are allowed"
            );
        }

        // Check file extension
        String filename = file.getOriginalFilename();
        if (filename == null || !hasAllowedExtension(filename)) {
            throw new IllegalArgumentException(
                    "Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed"
            );
        }

        // Additional security: Check magic bytes (file signature)
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length < 4) {
                throw new IllegalArgumentException("File is too small to be a valid image");
            }
            validateMagicBytes(bytes, contentType);
        } catch (IOException e) {
            throw new IllegalArgumentException("Could not read file content");
        }
    }

    /**
     * Validate file magic bytes (file signature) to prevent fake extensions
     */
    private void validateMagicBytes(byte[] bytes, String contentType) {
        if (contentType == null) {
            throw new IllegalArgumentException("Content type is null");
        }

        // JPEG: FF D8 FF
        if (contentType.equals("image/jpeg")) {
            if (bytes.length < 3 ||
                (bytes[0] & 0xFF) != 0xFF ||
                (bytes[1] & 0xFF) != 0xD8 ||
                (bytes[2] & 0xFF) != 0xFF) {
                throw new IllegalArgumentException("File is not a valid JPEG image");
            }
        }
        // PNG: 89 50 4E 47
        else if (contentType.equals("image/png")) {
            if (bytes.length < 4 ||
                (bytes[0] & 0xFF) != 0x89 ||
                (bytes[1] & 0xFF) != 0x50 ||
                (bytes[2] & 0xFF) != 0x4E ||
                (bytes[3] & 0xFF) != 0x47) {
                throw new IllegalArgumentException("File is not a valid PNG image");
            }
        }
        // WEBP: RIFF....WEBP
        else if (contentType.equals("image/webp")) {
            if (bytes.length < 12 ||
                bytes[0] != 'R' || bytes[1] != 'I' || bytes[2] != 'F' || bytes[3] != 'F' ||
                bytes[8] != 'W' || bytes[9] != 'E' || bytes[10] != 'B' || bytes[11] != 'P') {
                throw new IllegalArgumentException("File is not a valid WEBP image");
            }
        }
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null) {
            return "";
        }
        int lastDot = filename.lastIndexOf('.');
        return (lastDot == -1) ? "" : filename.substring(lastDot).toLowerCase();
    }

    /**
     * Check if filename has allowed extension
     */
    private boolean hasAllowedExtension(String filename) {
        String extension = getFileExtension(filename);
        return ALLOWED_EXTENSIONS.contains(extension);
    }

    /**
     * Get file path for serving
     */
    public Path getFilePath(String filename) {
        return Paths.get(uploadDir).resolve(filename);
    }
}
