import express from 'express';
import { Client, Storage } from 'appwrite';

const router = express.Router();

// Initialize Appwrite client for image serving
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setDevKey(process.env.APPWRITE_API_KEY);

const storage = new Storage(client);

// GET /api/images/url/:fileId - Get direct image URL (must be before /:fileId)
router.get('/url/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Validate fileId
        if (!fileId || fileId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        // Get file view URL from Appwrite Storage
        const fileViewUrl = storage.getFileView(
            process.env.APPWRITE_BUCKET_ID,
            fileId
        );

        // Return the URL as JSON
        res.json({
            success: true,
            data: {
                fileId,
                url: fileViewUrl.toString(),
                downloadUrl: storage.getFileDownload(
                    process.env.APPWRITE_BUCKET_ID,
                    fileId
                ).toString()
            }
        });

    } catch (error) {
        console.error('Error getting image URL:', error);
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to get image URL',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/images/info/:fileId - Get file information (must be before /:fileId)
router.get('/info/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Validate fileId
        if (!fileId || fileId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        // Get file information from Appwrite Storage
        const file = await storage.getFile(
            process.env.APPWRITE_BUCKET_ID,
            fileId
        );

        res.json({
            success: true,
            data: {
                id: file.$id,
                name: file.name,
                signature: file.signature,
                mimeType: file.mimeType,
                sizeOriginal: file.sizeOriginal,
                chunksTotal: file.chunksTotal,
                chunksUploaded: file.chunksUploaded,
                createdAt: file.$createdAt,
                updatedAt: file.$updatedAt
            }
        });

    } catch (error) {
        console.error('Error getting file info:', error);
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to get file information',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/images/download/:fileId - Download original file (must be before /:fileId)
router.get('/download/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Validate fileId
        if (!fileId || fileId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        // Get file download URL from Appwrite Storage
        const fileDownload = storage.getFileDownload(
            process.env.APPWRITE_BUCKET_ID,
            fileId
        );

        // Redirect to Appwrite's file download URL
        res.redirect(fileDownload.toString());

    } catch (error) {
        console.error('Error downloading file:', error);
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to download file',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET /api/images/:fileId - Serve image from Appwrite Storage (must be last)
router.get('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // Validate fileId
        if (!fileId || fileId.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'File ID is required'
            });
        }

        // Get file view URL from Appwrite Storage (no transformations)
        const fileView = storage.getFileView(
            process.env.APPWRITE_BUCKET_ID,
            fileId
        );

        // Redirect to Appwrite's file view URL
        res.redirect(fileView.toString());

    } catch (error) {
        console.error('Error serving image:', error);
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to serve image',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;
