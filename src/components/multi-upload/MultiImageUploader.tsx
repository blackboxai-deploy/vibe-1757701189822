'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateBatchUpload, BATCH_PROCESSING_LIMITS } from '@/lib/multi-processing';
import type { ProcessingQueueItem } from '@/types/extraction';

interface MultiImageUploaderProps {
  onFilesUpload: (files: File[]) => void;
  isProcessing: boolean;
  queue: ProcessingQueueItem[];
}

export default function MultiImageUploader({ 
  onFilesUpload, 
  isProcessing, 
  queue 
}: MultiImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      handleFileSelection(files);
    }
  }, []);

  const handleFileSelection = (fileList: FileList) => {
    const { valid, errors: validationErrors } = validateBatchUpload(fileList);
    
    setErrors(validationErrors);
    
    if (valid.length > 0) {
      onFilesUpload(valid);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files);
    }
  };

  const clearQueue = () => {
    // Clean up preview URLs to prevent memory leaks
    queue.forEach(item => {
      if (item.preview) {
        URL.revokeObjectURL(item.preview);
      }
    });
    setErrors([]);
  };

  const completedCount = queue.filter(item => item.status === 'completed').length;
  const failedCount = queue.filter(item => item.status === 'failed').length;
  const overallProgress = queue.length > 0 
    ? Math.round(((completedCount + failedCount) / queue.length) * 100)
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Batch Image Processing
            <Badge variant="secondary" className="text-xs">
              Multi-OCR
            </Badge>
          </CardTitle>
          {queue.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {completedCount}/{queue.length}
              </Badge>
              {!isProcessing && queue.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearQueue}
                >
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : errors.length > 0
              ? 'border-destructive bg-destructive/5'
              : 'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={BATCH_PROCESSING_LIMITS.supportedFormats.join(',')}
            onChange={handleFileInputChange}
            disabled={isProcessing}
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            id="multi-file-upload"
          />
          
          <div className="space-y-4">
            {isProcessing ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Processing {queue.length} images...</p>
                  <Progress value={overallProgress} className="w-full max-w-xs mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    {completedCount} completed • {failedCount} failed • {queue.length - completedCount - failedCount} remaining
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Upload Multiple Images</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop up to {BATCH_PROCESSING_LIMITS.maxFiles} images here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPEG, PNG, WebP, GIF • Max {BATCH_PROCESSING_LIMITS.maxFileSize / (1024 * 1024)}MB per file
                  </p>
                </div>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <div className="space-y-1">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm">
                    {error}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Queue Preview */}
        {queue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Processing Queue</h4>
              <Badge variant="secondary" className="text-xs">
                {queue.length} {queue.length === 1 ? 'image' : 'images'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {queue.map((item) => (
                <div 
                  key={item.id} 
                  className="relative group border border-border rounded-lg overflow-hidden bg-muted/50"
                >
                  <div className="aspect-square relative">
                    <img 
                      src={item.preview} 
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      {item.status === 'processing' && (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {item.status === 'completed' && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      {item.status === 'failed' && (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  {item.status === 'processing' && (
                    <div className="absolute bottom-0 left-0 right-0">
                      <Progress value={item.progress} className="h-1" />
                    </div>
                  )}
                  
                  {/* File Name */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-1">
                    <p className="text-xs truncate" title={item.file.name}>
                      {item.file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}