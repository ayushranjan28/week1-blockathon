const { createClient } = require('@pinata/sdk');
const FormData = require('form-data');
const axios = require('axios');

class IPFSService {
  constructor() {
    // Initialize Pinata client
    this.pinata = createClient({
      pinataApiKey: process.env.PINATA_API_KEY,
      pinataSecretApiKey: process.env.PINATA_SECRET_KEY
    });

    this.gatewayUrl = process.env.IPFS_GATEWAY_URL || 'https://gateway.pinata.cloud/ipfs/';
  }

  // Upload JSON data to IPFS via Pinata
  async uploadJSON(data) {
    try {
      console.log('Uploading JSON to IPFS:', data);
      
      const options = {
        pinataMetadata: {
          name: `proposal-${Date.now()}`,
          keyvalues: {
            type: 'proposal-metadata',
            timestamp: new Date().toISOString()
          }
        },
        pinataOptions: {
          cidVersion: 0
        }
      };

      const result = await this.pinata.pinJSONToIPFS(data, options);
      console.log('JSON uploaded successfully:', result.IpfsHash);
      
      return result.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
    }
  }

  // Retrieve JSON data from IPFS
  async getJSON(hash) {
    try {
      console.log('Retrieving JSON from IPFS:', hash);
      
      const url = `${this.gatewayUrl}${hash}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('JSON retrieved successfully');
      return response.data;
    } catch (error) {
      console.error('Error retrieving JSON from IPFS:', error);
      throw new Error(`Failed to retrieve JSON from IPFS: ${error.message}`);
    }
  }

  // Upload file to IPFS via Pinata
  async uploadFile(file) {
    try {
      console.log('Uploading file to IPFS:', file.originalname);
      
      const formData = new FormData();
      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype
      });

      const options = {
        pinataMetadata: {
          name: file.originalname,
          keyvalues: {
            type: 'proposal-attachment',
            timestamp: new Date().toISOString()
          }
        },
        pinataOptions: {
          cidVersion: 0
        }
      };

      formData.append('pinataOptions', JSON.stringify(options.pinataOptions));
      formData.append('pinataMetadata', JSON.stringify(options.pinataMetadata));

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'pinata_api_key': process.env.PINATA_API_KEY,
            'pinata_secret_api_key': process.env.PINATA_SECRET_KEY,
            ...formData.getHeaders()
          },
          timeout: 30000
        }
      );

      console.log('File uploaded successfully:', response.data.IpfsHash);
      
      return {
        hash: response.data.IpfsHash,
        size: file.size,
        name: file.originalname,
        url: `${this.gatewayUrl}${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error(`Failed to upload file to IPFS: ${error.message}`);
    }
  }

  // Get file from IPFS
  async getFile(hash) {
    try {
      console.log('Retrieving file from IPFS:', hash);
      
      const url = `${this.gatewayUrl}${hash}`;
      const response = await axios.get(url, {
        timeout: 30000,
        responseType: 'arraybuffer'
      });
      
      console.log('File retrieved successfully');
      
      return {
        hash,
        content: Buffer.from(response.data),
        size: response.data.byteLength,
        url
      };
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      throw new Error(`Failed to retrieve file from IPFS: ${error.message}`);
    }
  }

  // Upload proposal metadata with attachments
  async uploadProposalMetadata(proposalData, attachments = []) {
    try {
      console.log('Uploading proposal metadata with attachments');
      
      const metadata = {
        ...proposalData,
        attachments: [],
        uploadedAt: new Date().toISOString()
      };

      // Upload attachments if any
      if (attachments && attachments.length > 0) {
        for (const attachment of attachments) {
          const fileResult = await this.uploadFile(attachment);
          metadata.attachments.push({
            name: attachment.originalname,
            hash: fileResult.hash,
            size: attachment.size,
            url: fileResult.url
          });
        }
      }

      // Upload the complete metadata
      const hash = await this.uploadJSON(metadata);
      
      return {
        hash,
        metadata,
        attachments: metadata.attachments
      };
    } catch (error) {
      console.error('Error uploading proposal metadata:', error);
      throw new Error(`Failed to upload proposal metadata: ${error.message}`);
    }
  }

  // Get proposal metadata with attachments
  async getProposalMetadata(hash) {
    try {
      console.log('Retrieving proposal metadata:', hash);
      
      const metadata = await this.getJSON(hash);
      
      return {
        ...metadata,
        ipfsHash: hash,
        ipfsUrl: `${this.gatewayUrl}${hash}`
      };
    } catch (error) {
      console.error('Error retrieving proposal metadata:', error);
      throw new Error(`Failed to retrieve proposal metadata: ${error.message}`);
    }
  }

  // Pin content to IPFS (ensure it stays available)
  async pinContent(hash) {
    try {
      console.log('Pinning content to IPFS:', hash);
      
      const result = await this.pinata.pinByHash(hash, {
        pinataMetadata: {
          name: `pinned-content-${hash}`,
          keyvalues: {
            type: 'pinned-content',
            timestamp: new Date().toISOString()
          }
        }
      });
      
      console.log('Content pinned successfully');
      return result;
    } catch (error) {
      console.error('Error pinning content:', error);
      throw new Error(`Failed to pin content: ${error.message}`);
    }
  }

  // Unpin content from IPFS
  async unpinContent(hash) {
    try {
      console.log('Unpinning content from IPFS:', hash);
      
      await this.pinata.unpin(hash);
      console.log('Content unpinned successfully');
      
      return true;
    } catch (error) {
      console.error('Error unpinning content:', error);
      throw new Error(`Failed to unpin content: ${error.message}`);
    }
  }

  // Get pinned content list
  async getPinnedContent() {
    try {
      console.log('Getting pinned content list');
      
      const result = await this.pinata.pinList({
        status: 'pinned',
        pageLimit: 1000
      });
      
      return result.rows;
    } catch (error) {
      console.error('Error getting pinned content:', error);
      throw new Error(`Failed to get pinned content: ${error.message}`);
    }
  }

  // Validate IPFS hash format
  isValidIPFSHash(hash) {
    // Basic validation for IPFS hash format
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || 
           /^bafybei[a-z2-7]{52}$/.test(hash);
  }

  // Get IPFS gateway URL for a hash
  getGatewayUrl(hash) {
    return `${this.gatewayUrl}${hash}`;
  }
}

module.exports = new IPFSService();
