'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText } from '@/components/ui/responsive-container'
import { apiService } from '@/lib/api-service'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  ipfsHash: string
  url: string
  uploadedAt: number
  status: 'uploading' | 'success' | 'error'
}

export function IPFSUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      await uploadFile(file)
    }
  }

  const uploadFile = async (file: File) => {
    const fileId = Date.now().toString()
    
    // Add file to list with uploading status
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      ipfsHash: '',
      url: '',
      uploadedAt: Date.now(),
      status: 'uploading'
    }
    
    setUploadedFiles(prev => [newFile, ...prev])
    
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload to IPFS via backend
      const response = await apiService.uploadFile(file)
      
      // Update file with success status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              ipfsHash: response.data.ipfsHash,
              url: response.data.url,
              status: 'success' 
            }
          : f
      ))
      
    } catch (error) {
      console.error('Error uploading file:', error)
      
      // Update file with error status
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error' }
          : f
      ))
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    } else if (type.startsWith('text/')) {
      return <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
    } else {
      return <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <LoadingSpinner size="sm" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <File className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <ResponsiveContainer maxWidth="full" padding="lg">
      <div className="space-y-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <ResponsiveText 
            size={{ default: '2xl', sm: '3xl', md: '4xl' }}
            weight="bold"
            className="mb-4"
          >
            IPFS File Upload
          </ResponsiveText>
          <ResponsiveText 
            size={{ default: 'base', sm: 'lg' }}
            color="muted"
          >
            Upload files to decentralized storage for proposal attachments
          </ResponsiveText>
        </motion.div>

        {/* Upload Area */}
        <EnhancedCard variant="glass">
          <EnhancedCardHeader>
            <EnhancedCardTitle>Upload Files</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <Upload className="h-12 w-12 text-gray-400 dark:text-neutral-600 mx-auto mb-4" />
              <ResponsiveText 
                size={{ default: 'lg', sm: 'xl' }}
                weight="semibold"
                className="mb-2"
              >
                Drop files here or click to upload
              </ResponsiveText>
              <ResponsiveText 
                size={{ default: 'sm', sm: 'base' }}
                color="muted"
                className="mb-4"
              >
                Supports images, documents, and other files up to 10MB
              </ResponsiveText>
              <EnhancedButton 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose Files
              </EnhancedButton>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Uploaded Files ({uploadedFiles.length})</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getFileIcon(file.type)}
                      <div>
                        <ResponsiveText 
                          size={{ default: 'sm', sm: 'base' }}
                          weight="medium"
                          className="mb-1"
                        >
                          {file.name}
                        </ResponsiveText>
                        <ResponsiveText 
                          size={{ default: 'xs', sm: 'sm' }}
                          color="muted"
                        >
                          {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </ResponsiveText>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {file.status === 'success' && file.ipfsHash && (
                        <div className="flex items-center space-x-2">
                          <ResponsiveText 
                            size={{ default: 'xs', sm: 'sm' }}
                            color="muted"
                            className="font-mono"
                          >
                            {file.ipfsHash.slice(0, 10)}...{file.ipfsHash.slice(-6)}
                          </ResponsiveText>
                          <EnhancedButton 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(file.ipfsHash)}
                          >
                            <Copy className="h-4 w-4" />
                          </EnhancedButton>
                          {file.url && (
                            <EnhancedButton 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </EnhancedButton>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(file.status)}
                        <EnhancedButton 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </EnhancedButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        )}

        {/* IPFS Information */}
        <EnhancedCard variant="glass">
          <EnhancedCardHeader>
            <EnhancedCardTitle>About IPFS Storage</EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <ResponsiveGrid cols={{ default: 1, sm: 2 }} gap="lg">
              <div className="space-y-4">
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl' }}
                  weight="semibold"
                  className="mb-2"
                >
                  Decentralized Storage
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'sm', sm: 'base' }}
                  color="muted"
                >
                  Files are stored on the InterPlanetary File System (IPFS), a peer-to-peer 
                  distributed file system that makes the web faster, safer, and more open.
                </ResponsiveText>
              </div>
              <div className="space-y-4">
                <ResponsiveText 
                  size={{ default: 'lg', sm: 'xl' }}
                  weight="semibold"
                  className="mb-2"
                >
                  Permanent & Immutable
                </ResponsiveText>
                <ResponsiveText 
                  size={{ default: 'sm', sm: 'base' }}
                  color="muted"
                >
                  Once uploaded, files are permanently stored and cannot be modified or deleted, 
                  ensuring the integrity of proposal attachments and documents.
                </ResponsiveText>
              </div>
            </ResponsiveGrid>
          </EnhancedCardContent>
        </EnhancedCard>
      </div>
    </ResponsiveContainer>
  )
}
