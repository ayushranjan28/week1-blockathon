'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  FileText, 
  DollarSign, 
  Calendar, 
  Tag,
  Upload,
  Save,
  Send
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAccount, useWalletClient } from 'wagmi'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { smartContractService } from '@/lib/smart-contract-service'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'

const proposalSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.string().min(1, 'Budget is required'),
  targets: z.array(z.string()).optional(),
  values: z.array(z.string()).optional(),
  calldatas: z.array(z.string()).optional(),
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
    name: 'Infrastructure Project',
    description: 'Template for infrastructure and public works proposals',
    icon: '🏗️',
    fields: {
      title: 'Infrastructure Project: ',
      description: '## Problem Statement\n\n## Proposed Solution\n\n## Budget Breakdown\n\n## Timeline\n\n## Expected Benefits',
      category: 'Infrastructure'
    }
  },
  {
    id: 'environment',
    name: 'Environmental Initiative',
    description: 'Template for environmental and sustainability proposals',
    icon: '🌱',
    fields: {
      title: 'Environmental Initiative: ',
      description: '## Environmental Impact\n\n## Proposed Actions\n\n## Budget Requirements\n\n## Implementation Plan\n\n## Expected Outcomes',
      category: 'Environment'
    }
  },
  {
    id: 'education',
    name: 'Education Program',
    description: 'Template for education and community programs',
    icon: '📚',
    fields: {
      title: 'Education Program: ',
      description: '## Educational Need\n\n## Program Description\n\n## Target Audience\n\n## Budget Breakdown\n\n## Success Metrics',
      category: 'Education'
    }
  }
]

export default function CreateProposalPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProposalFormData>({
    resolver: zodResolver(proposalSchema),
    mode: 'onChange'
  })

  const watchedValues = watch()

  const handleTemplateSelect = (templateId: string) => {
    const template = proposalTemplates.find(t => t.id === templateId)
    if (template) {
      setValue('title', template.fields.title)
      setValue('description', template.fields.description)
      setValue('category', template.fields.category)
      setSelectedTemplate(templateId)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ProposalFormData) => {
    if (!isConnected || !address || !walletClient) {
      toast.error('Please connect your wallet to create a proposal')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Check if user's identity is verified
      const isVerified = await smartContractService.isIdentityVerified(address)
      if (!isVerified) {
        toast.error('Please verify your identity before creating a proposal')
        setIsSubmitting(false)
        return
      }

      // Prepare proposal data for smart contract
      const targets: `0x${string}`[] = data.targets?.map(t => t as `0x${string}`) || []
      const values: bigint[] = data.values?.map(v => parseEther(v || '0')) || [0n]
      const calldatas: `0x${string}`[] = data.calldatas?.map(c => c as `0x${string}`) || ['0x']
      
      const description = `${data.title}\n\n${data.description}`
      
      toast.loading('Creating proposal on blockchain...', { id: 'create-proposal' })

      // Create proposal on smart contract
      const result = await smartContractService.createProposal(
        targets,
        values,
        calldatas,
        description,
        data.title,
        data.budget,
        data.category,
        address,
        walletClient
      )

      if (result.success) {
        toast.success('Proposal created successfully on blockchain!', { id: 'create-proposal' })
        
        // Wait for transaction confirmation
        if (result.hash) {
          toast.loading('Waiting for transaction confirmation...', { id: 'create-tx' })
          await smartContractService.waitForTransaction(result.hash)
          toast.success('Transaction confirmed!', { id: 'create-tx' })
        }
        
        router.push('/citizen')
      } else {
        throw new Error('Failed to create proposal on contract')
      }
    } catch (error) {
      console.error('Proposal creation failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create proposal'
      toast.error(errorMessage, { id: 'create-proposal' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-8">
            Connect your wallet to create and submit governance proposals.
          </p>
          <Button className="btn-primary">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/citizen" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Citizen Portal
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Proposal
          </h1>
          <p className="text-gray-600">
            Submit a proposal for community consideration and voting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Proposal Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Proposal Templates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {proposalTemplates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                          selectedTemplate === template.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{template.icon}</div>
                        <div className="font-medium text-gray-900 mb-1">
                          {template.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {template.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proposal Title *
                    </label>
                    <Input
                      {...register('title')}
                      placeholder="Enter a clear, descriptive title for your proposal"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget (CIVIC tokens) *
                    </label>
                    <Input
                      {...register('budget')}
                      type="number"
                      placeholder="Enter budget amount in CIVIC tokens"
                      className={errors.budget ? 'border-red-500' : ''}
                    />
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Proposal Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description *
                      </label>
                      <Textarea
                        {...register('description')}
                        placeholder="Provide a detailed description of your proposal. Use markdown formatting for better readability."
                        className={`min-h-[300px] ${errors.description ? 'border-red-500' : ''}`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <p>Use markdown formatting for better readability:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><code>## Section Headers</code> for main sections</li>
                        <li><code>**Bold text**</code> for emphasis</li>
                        <li><code>- List items</code> for bullet points</li>
                        <li><code>1. Numbered items</code> for numbered lists</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Attachments (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload supporting documents, images, or other files (max 10MB each)
                      </p>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {isValid ? 'Ready to submit' : 'Please complete all required fields'}
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="btn-primary"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Create Proposal
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Proposal Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p>Be clear and specific about your proposal's goals</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p>Include a detailed budget breakdown</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p>Provide a realistic timeline for implementation</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p>Explain the expected benefits to the community</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p>Use markdown formatting for better readability</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Minimum Budget</span>
                  <Badge variant="outline">1,000 CIVIC</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Maximum Budget</span>
                  <Badge variant="outline">1,000,000 CIVIC</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Voting Period</span>
                  <Badge variant="outline">7 days</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Quorum Required</span>
                  <Badge variant="outline">4%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Title:</div>
                    <div className="text-gray-600">
                      {watchedValues.title || 'Enter a title...'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Category:</div>
                    <div className="text-gray-600">
                      {watchedValues.category || 'Select a category...'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Budget:</div>
                    <div className="text-gray-600">
                      {watchedValues.budget ? `${watchedValues.budget} CIVIC` : 'Enter budget...'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
