'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ImageUploader from '@/components/ImageUploader';
import TextResult from '@/components/TextResult';
import ExtractionHistory from '@/components/ExtractionHistory';
import MultiImageUploader from '@/components/multi-upload/MultiImageUploader';
import BatchResults from '@/components/multi-upload/BatchResults';
import { convertFileToBase64, generateId } from '@/lib/imageUtils';
import { createProcessingQueue, processImageBatch } from '@/lib/multi-processing';
import type { ExtractionResult, ApiResponse, ProcessingQueueItem } from '@/types/extraction';

const STORAGE_KEY = 'image-text-extraction-history';
const MAX_HISTORY_ITEMS = 20;

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ExtractionResult | null>(null);
  const [history, setHistory] = useState<ExtractionResult[]>([]);
  
  // Multi-image processing state
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [processingQueue, setProcessingQueue] = useState<ProcessingQueueItem[]>([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [history]);

  // Single image processing
  const handleFileUpload = async (file: File) => {
    if (isProcessing) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Convert file to base64
      const base64Image = await convertFileToBase64(file);
      
      // Create preview URL
      const imageUrl = URL.createObjectURL(file);

      // Make API request
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          fileName: file.name
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.text) {
        const result: ExtractionResult = {
          id: generateId(),
          text: data.text,
          fileName: file.name,
          timestamp: new Date(),
          imageUrl,
          processingTime: data.processingTime || (Date.now() - startTime)
        };

        setCurrentResult(result);
        
        // Add to history (keep only the most recent items)
        setHistory(prev => [result, ...prev.slice(0, MAX_HISTORY_ITEMS - 1)]);
        
        toast.success('Text extracted successfully!', {
          description: `Processed in ${(result.processingTime / 1000).toFixed(1)}s`
        });
      } else {
        throw new Error(data.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast.error('Text extraction failed', {
        description: errorMessage
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Multi-image processing
  const handleMultiImageUpload = async (files: File[]) => {
    if (isBatchProcessing) return;

    const queue = createProcessingQueue(files);
    setProcessingQueue(queue);
    setIsBatchProcessing(true);

    try {
      await processImageBatch(queue, (updatedQueue) => {
        setProcessingQueue([...updatedQueue]);
      });

      // Add completed results to history
      const completedResults = queue
        .filter(item => item.status === 'completed' && item.result)
        .map(item => item.result!);
      
      if (completedResults.length > 0) {
        setHistory(prev => [...completedResults, ...prev].slice(0, MAX_HISTORY_ITEMS));
        
        toast.success(`Batch processing complete!`, {
          description: `${completedResults.length} images processed successfully`
        });
      }
    } catch (error) {
      console.error('Error in batch processing:', error);
      toast.error('Batch processing encountered errors', {
        description: 'Some images may have failed to process'
      });
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleCopyText = () => {
    toast.success('Text copied to clipboard!');
  };

  const handleDownloadText = () => {
    toast.success('Text file downloaded!');
  };

  const handleSelectHistoryResult = (result: ExtractionResult) => {
    setCurrentResult(result);
    toast.info('Viewing previous extraction');
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentResult(null);
    toast.success('History cleared');
  };

  const handleClearBatchResults = () => {
    setProcessingQueue([]);
    toast.success('Batch results cleared');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            AI-Powered Text Extraction
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform images into editable text with our advanced OCR technology. 
            Process single images or batch multiple files simultaneously with industry-leading accuracy.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Badge variant="secondary" className="text-sm">99.5% Accuracy</Badge>
            <Badge variant="secondary" className="text-sm">50+ Languages</Badge>
            <Badge variant="secondary" className="text-sm">Batch Processing</Badge>
            <Badge variant="secondary" className="text-sm">Privacy First</Badge>
          </div>
        </div>

        {/* Processing Options */}
        <Tabs defaultValue="single" className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Single Image
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Batch Processing
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Single Image Processing */}
          <TabsContent value="single" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Upload and Result */}
              <div className="lg:col-span-2 space-y-6">
                <ImageUploader
                  onFileUpload={handleFileUpload}
                  isProcessing={isProcessing}
                />

                <TextResult
                  result={currentResult}
                  isProcessing={isProcessing}
                  onCopy={handleCopyText}
                  onDownload={handleDownloadText}
                />
              </div>

              {/* Right Column - History */}
              <div className="lg:col-span-1">
                <ExtractionHistory
                  history={history}
                  onSelectResult={handleSelectHistoryResult}
                  onClearHistory={handleClearHistory}
                />
              </div>
            </div>
          </TabsContent>

          {/* Batch Processing */}
          <TabsContent value="batch" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <MultiImageUploader
                  onFilesUpload={handleMultiImageUpload}
                  isProcessing={isBatchProcessing}
                  queue={processingQueue}
                />
              </div>
              <div>
                <BatchResults
                  queue={processingQueue}
                  onClearResults={handleClearBatchResults}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-border">
          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Process images in under 3 seconds with our optimized AI models
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">99.5% Accurate</h3>
              <p className="text-sm text-muted-foreground">
                Industry-leading accuracy powered by advanced neural networks
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 mx-auto bg-purple-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Batch Processing</h3>
              <p className="text-sm text-muted-foreground">
                Process up to 10 images simultaneously with smart queuing
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-md">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 mx-auto bg-orange-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data is processed securely and never stored permanently
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Join thousands of users who trust ImageToText for accurate, fast, and secure text extraction. 
              No registration required - start processing your images instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="shadow-md">
                Start Extracting Text
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/about">Learn More</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}