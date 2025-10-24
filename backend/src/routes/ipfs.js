const express = require('express');
const router = express.Router();
const ipfsController = require('../controllers/ipfsController');
const { authenticateUser } = require('../middleware/auth');
const { upload, handleUploadError } = require('../middleware/upload');

// Upload file to IPFS
router.post('/upload', authenticateUser, upload.single('file'), handleUploadError, ipfsController.uploadFile);

// Upload JSON data to IPFS
router.post('/upload-json', authenticateUser, ipfsController.uploadJSON);

// Get file from IPFS
router.get('/:hash', ipfsController.getFile);

// Pin file to IPFS
router.post('/pin/:hash', authenticateUser, ipfsController.pinFile);

// Unpin file from IPFS
router.delete('/pin/:hash', authenticateUser, ipfsController.unpinFile);

// Get file metadata
router.get('/:hash/metadata', ipfsController.getFileMetadata);

// Get pinned content list
router.get('/', authenticateUser, ipfsController.getPinnedContent);

module.exports = router;
