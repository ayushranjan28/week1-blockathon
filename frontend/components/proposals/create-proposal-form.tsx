'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  FileText, 
  Upload, 
  X, 
  DollarSign, 
  Calendar, 
  Tag,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { EnhancedButton } from '@/components/ui/enhanced-button'
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive-container'
import { apiService } from '@/lib/api-service'
import toast from 'react-hot-toast'

const proposalSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000, 'Description must be less than 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.string().min(1, 'Budget is required').refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, 'Budget must be a positive number'),
  deadline: z.string().min(1, 'Deadline is required'),
  attachments: z.array(z.any()).optional()
})

type ProposalFormData = z.infer<typeof proposalSchema>

const categories = [
  'Infrastructure',
  'Environment',
  'Education',
  'Healthcare',
  'Transportation',
  'Safety',
  'Culture',
  'Technology',
  'Other'
]

const proposalTemplates = [
  {
    id: 'infrastructure',
    title: 'Infrastructure Project',
    description: 'Template for infrastructure-related proposals',
    category: 'Infrastructure',
    budget: '50000',
    content: {
      title: 'New Infrastructure Initiative',
      description: 'This proposal aims to implement a new infrastructure project that will benefit the community. The project includes detailed planning, implementation phases, and expected outcomes.',
      category: 'Infrastructure',
      budget: '50000'
    }
  },
  {
    id: 'environment',
    title: 'Environmental Initiative',
    description: 'Template for environmental and sustainability proposals',
    category: 'Environment',
    budget: '25000',
    content: {
      title: 'Environmental Sustainability Project',
      description: 'This proposal focuses on environmental improvements and sustainability initiatives. It includes measures to reduce environmental impact and promote green practices.',
      category: 'Environment',
      budget: '25000'
    }
  },
  {
    id: 'community',
    title: 'Community Development',
    description: 'Template for community-focused proposals',
    category: 'Culture',
    budget: '30000',
    content: {
      title: 'Community Development Initiative',
      description: 'This proposal aims to strengthen community bonds and improve quality of life through various community-focused activities and programs.',
      category: 'Culture',
      budget: '30000'
    }
  }
]

export function CreateProposalForm() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema)
  })

  const watchedValues = watch()

  const handleTemplateSelect = (template: typeof proposalTemplates[0]) => {
    setSelectedTemplate(template.id)
    setValue('title', template.content.title)
    setValue('description', template.content.description)
    setValue('category', template.content.category)
    setValue('budget', template.content.budget)
  }

  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files)
    const validFiles = newFiles.filter(file => {
      const maxSize = 10 * 1024 * 1024 // 10MB
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
        'application/json'
      ]
      return file.size <= maxSize && allowedTypes.includes(file.type)
    })

    if (validFiles.length !== newFiles.length) {
      toast.error('Some files were rejected due to size or type restrictions')
    }

    setAttachments(prev => [...prev, ...validFiles])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const uploadAttachments = async () => {
    const uploadedAttachments = []
    
    for (let i = 0; i < attachments.length; i++) {
      const file = attachments[i]
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }))
        
        const response = await apiService.uploadFile(file)
        
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }))
        uploadedAttachments.push({
          name: file.name,
          hash: response.data.hash,
          size: file.size,
          url: response.data.url
        })
      } catch (error) {
        console.error('File upload failed:', error)
        toast.error(`Failed to upload ${file.name}`)
        throw error
      }
    }
    
    return uploadedAttachments
  }

  const onSubmit = async (data: ProposalFormData) => {
    if (!apiService.isAuthenticated()) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Upload attachments if any
      let uploadedAttachments: any[] = []
      if (attachments.length > 0) {
        uploadedAttachments = await uploadAttachments()
      }

      // Create proposal
      const proposalData = {
        ...data,
        attachments: uploadedAttachments,
        targets: [], // Default empty targets
        values: [0], // Default zero value
        calldatas: ['0x'] // Default empty calldata
      }

      const response = await apiService.createProposal(proposalData)
      
      if (response.success) {
        toast.success('Proposal created successfully!')
        reset()
        setAttachments([])
        setSelectedTemplate(null)
        setUploadProgress({})
      } else {
        throw new Error(response.message || 'Failed to create proposal')
      }
    } catch (error) {
      console.error('Proposal creation failed:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create proposal')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ResponsiveContainer maxWidth="2xl" padding="lg">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <ResponsiveText 
            size={{ default: '2xl', sm: '3xl', md: '4xl' }}
            weight="bold"
            className="mb-4"
          >
            Create New Proposal
          </ResponsiveText>
          <ResponsiveText 
            size={{ default: 'base', sm: 'lg' }}
            color="muted"
          >
            Submit a proposal to improve your city and community
          </ResponsiveText>
        </motion.div>

        {/* Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Choose a Template (Optional)</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {proposalTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedTemplate === template.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-neutral-700 hover:border-primary-300 hover:bg-primary-50/50 dark:hover:bg-primary-900/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ResponsiveText 
                        size={{ default: 'base', sm: 'lg' }}
                        weight="semibold"
                      >
                        {template.title}
                      </ResponsiveText>
                      {selectedTemplate === template.id && (
                        <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <ResponsiveText 
                      size={{ default: 'sm' }}
                      color="muted"
                      className="mb-2"
                    >
                      {template.description}
                    </ResponsiveText>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-neutral-400">
                      <span className="flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {template.category}
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${parseInt(template.budget).toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>

        {/* Proposal Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedCard variant="glass">
            <EnhancedCardHeader>
              <EnhancedCardTitle>Proposal Details</EnhancedCardTitle>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Proposal Title *
                  </label>
                  <input
                    {...register('title')}
                    type="text"
                    placeholder="Enter a clear, descriptive title for your proposal"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Provide a detailed description of your proposal, including objectives, implementation plan, and expected outcomes"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Category and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                      Budget (USD) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        {...register('budget')}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {errors.budget && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Proposed Deadline *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      {...register('deadline')}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  {errors.deadline && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.deadline.message}
                    </p>
                  )}
                </div>

                {/* File Attachments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg p-6">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.txt,.json"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <ResponsiveText 
                        size={{ default: 'sm', sm: 'base' }}
                        weight="medium"
                        className="text-gray-600 dark:text-neutral-400"
                      >
                        Click to upload files or drag and drop
                      </ResponsiveText>
                      <ResponsiveText 
                        size={{ default: 'xs', sm: 'sm' }}
                        color="muted"
                      >
                        PNG, JPG, PDF, TXT up to 10MB each
                      </ResponsiveText>
                    </label>
                  </div>

                  {/* Attachment List */}
                  {attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <ResponsiveText 
                                size={{ default: 'sm' }}
                                weight="medium"
                              >
                                {file.name}
                              </ResponsiveText>
                              <ResponsiveText 
                                size={{ default: 'xs' }}
                                color="muted"
                              >
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </ResponsiveText>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {uploadProgress[file.name] !== undefined && (
                              <div className="w-16 h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary-600 transition-all duration-300"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-neutral-700">
                  <EnhancedButton
                    type="button"
                    variant="outline"
                    onClick={() => {
                      reset()
                      setAttachments([])
                      setSelectedTemplate(null)
                    }}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </EnhancedButton>
                  <EnhancedButton
                    type="submit"
                    variant="default"
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Create Proposal
                      </>
                    )}
                  </EnhancedButton>
                </div>
              </form>
            </EnhancedCardContent>
          </EnhancedCard>
        </motion.div>
      </div>
    </ResponsiveContainer>
  )
}
