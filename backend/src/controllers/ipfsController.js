const ipfsService = require('../services/ipfsService');

// Upload file to IPFS
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    const result = await ipfsService.uploadFile(req.file);
    
    res.json({
      success: true,
      data: result,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: error.message
    });
  }
};

// Upload JSON data to IPFS
const uploadJSON = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No data provided'
      });
    }

    const hash = await ipfsService.uploadJSON(data);
    
    res.json({
      success: true,
      data: { hash, url: ipfsService.getGatewayUrl(hash) },
      message: 'JSON uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading JSON:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload JSON',
      error: error.message
    });
  }
};

// Get file from IPFS
const getFile = async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.isValidIPFSHash(hash)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IPFS hash format'
      });
    }

    const file = await ipfsService.getFile(hash);
    
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${hash}"`,
      'Content-Length': file.size
    });
    
    res.send(file.content);
  } catch (error) {
    console.error('Error getting file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file',
      error: error.message
    });
  }
};

// Pin file to IPFS
const pinFile = async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.isValidIPFSHash(hash)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IPFS hash format'
      });
    }

    const result = await ipfsService.pinContent(hash);
    
    res.json({
      success: true,
      data: result,
      message: 'File pinned successfully'
    });
  } catch (error) {
    console.error('Error pinning file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to pin file',
      error: error.message
    });
  }
};

// Unpin file from IPFS
const unpinFile = async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.isValidIPFSHash(hash)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IPFS hash format'
      });
    }

    await ipfsService.unpinContent(hash);
    
    res.json({
      success: true,
      message: 'File unpinned successfully'
    });
  } catch (error) {
    console.error('Error unpinning file:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unpin file',
      error: error.message
    });
  }
};

// Get file metadata
const getFileMetadata = async (req, res) => {
  try {
    const { hash } = req.params;
    
    if (!ipfsService.isValidIPFSHash(hash)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid IPFS hash format'
      });
    }

    // Try to get JSON metadata first
    try {
      const metadata = await ipfsService.getJSON(hash);
      res.json({
        success: true,
        data: {
          hash,
          type: 'json',
          url: ipfsService.getGatewayUrl(hash),
          metadata
        }
      });
    } catch (jsonError) {
      // If not JSON, return basic file info
      res.json({
        success: true,
        data: {
          hash,
          type: 'file',
          url: ipfsService.getGatewayUrl(hash)
        }
      });
    }
  } catch (error) {
    console.error('Error getting file metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve file metadata',
      error: error.message
    });
  }
};

// Get pinned content list
const getPinnedContent = async (req, res) => {
  try {
    const content = await ipfsService.getPinnedContent();
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error getting pinned content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pinned content',
      error: error.message
    });
  }
};

module.exports = {
  uploadFile,
  uploadJSON,
  getFile,
  pinFile,
  unpinFile,
  getFileMetadata,
  getPinnedContent
};
