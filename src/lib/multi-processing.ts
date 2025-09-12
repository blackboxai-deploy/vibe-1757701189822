import { generateId } from './imageUtils';
import type { ExtractionResult, ProcessingQueueItem, BatchProcessingState } from '@/types/extraction';

export const BATCH_PROCESSING_LIMITS = {
  maxFiles: 10,
  maxFileSize: 10 * 1024 * 1024, // 10MB per file
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  concurrentProcessing: 3, // Process 3 images simultaneously
};

export function createProcessingQueue(files: File[]): ProcessingQueueItem[] {
  return files.map(file => ({
    file,
    preview: URL.createObjectURL(file),
    id: generateId(),
    status: 'pending',
    progress: 0,
  }));
}

export function updateQueueItem(
  queue: ProcessingQueueItem[], 
  id: string, 
  updates: Partial<ProcessingQueueItem>
): ProcessingQueueItem[] {
  return queue.map(item => 
    item.id === id ? { ...item, ...updates } : item
  );
}

export function calculateBatchProgress(queue: ProcessingQueueItem[]): BatchProcessingState {
  const totalItems = queue.length;
  const completedItems = queue.filter(item => item.status === 'completed').length;
  const failedItems = queue.filter(item => item.status === 'failed').length;
  const processingItems = queue.filter(item => item.status === 'processing').length;
  const isProcessing = processingItems > 0 || queue.some(item => item.status === 'pending');
  
  const overallProgress = totalItems > 0 
    ? Math.round(((completedItems + failedItems) / totalItems) * 100)
    : 0;

  return {
    items: queue,
    totalItems,
    completedItems,
    failedItems,
    isProcessing,
    overallProgress,
  };
}

export async function processImageBatch(
  queue: ProcessingQueueItem[],
  onProgress: (updatedQueue: ProcessingQueueItem[]) => void
): Promise<ProcessingQueueItem[]> {
  const pendingItems = queue.filter(item => item.status === 'pending');
  const concurrentLimit = Math.min(BATCH_PROCESSING_LIMITS.concurrentProcessing, pendingItems.length);
  
  // Process items in batches of concurrent requests
  for (let i = 0; i < pendingItems.length; i += concurrentLimit) {
    const batch = pendingItems.slice(i, i + concurrentLimit);
    
    // Start processing all items in this batch concurrently
    const batchPromises = batch.map(async (item) => {
      try {
        // Update status to processing
        const updatedQueue = updateQueueItem(queue, item.id, { 
          status: 'processing', 
          progress: 10 
        });
        onProgress(updatedQueue);

        // Convert file to base64
        const base64Image = await convertFileToBase64(item.file);
        
        // Update progress
        const progressQueue = updateQueueItem(queue, item.id, { progress: 30 });
        onProgress(progressQueue);

        // Make API request
        const response = await fetch('/api/extract-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64Image,
            fileName: item.file.name
          })
        });

        // Update progress
        const responseQueue = updateQueueItem(queue, item.id, { progress: 70 });
        onProgress(responseQueue);

        const data = await response.json();

        if (data.success && data.text) {
          const result: ExtractionResult = {
            id: item.id,
            text: data.text,
            fileName: item.file.name,
            timestamp: new Date(),
            imageUrl: item.preview,
            processingTime: data.processingTime || 0
          };

          // Update to completed
          const completedQueue = updateQueueItem(queue, item.id, {
            status: 'completed',
            result,
            progress: 100
          });
          onProgress(completedQueue);
          
          return completedQueue.find(q => q.id === item.id)!;
        } else {
          throw new Error(data.error || 'Failed to extract text');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // Update to failed
        const failedQueue = updateQueueItem(queue, item.id, {
          status: 'failed',
          error: errorMessage,
          progress: 100
        });
        onProgress(failedQueue);
        
        return failedQueue.find(q => q.id === item.id)!;
      }
    });

    // Wait for this batch to complete before starting the next
    await Promise.all(batchPromises);
  }

  return queue;
}

export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

export function downloadBatchResults(results: ExtractionResult[], format: 'txt' | 'csv' | 'json' = 'txt') {
  let content = '';
  let filename = `batch-extraction-${Date.now()}`;
  let mimeType = 'text/plain';

  switch (format) {
    case 'txt':
      content = results.map((result, index) => 
        `=== File ${index + 1}: ${result.fileName} ===\n${result.text}\n\n`
      ).join('');
      filename += '.txt';
      break;
      
    case 'csv':
      const csvHeader = 'File Name,Extracted Text,Processing Time (ms),Timestamp\n';
      const csvRows = results.map(result => 
        `"${result.fileName}","${result.text.replace(/"/g, '""')}",${result.processingTime},"${result.timestamp.toISOString()}"`
      ).join('\n');
      content = csvHeader + csvRows;
      filename += '.csv';
      mimeType = 'text/csv';
      break;
      
    case 'json':
      content = JSON.stringify(results.map(result => ({
        fileName: result.fileName,
        text: result.text,
        processingTime: result.processingTime,
        timestamp: result.timestamp.toISOString()
      })), null, 2);
      filename += '.json';
      mimeType = 'application/json';
      break;
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function validateBatchUpload(files: FileList): { valid: File[]; errors: string[] } {
  const valid: File[] = [];
  const errors: string[] = [];

  // Check file count
  if (files.length > BATCH_PROCESSING_LIMITS.maxFiles) {
    errors.push(`Maximum ${BATCH_PROCESSING_LIMITS.maxFiles} files allowed. You selected ${files.length} files.`);
    return { valid, errors };
  }

  Array.from(files).forEach(file => {
    // Check file format
    if (!BATCH_PROCESSING_LIMITS.supportedFormats.includes(file.type)) {
      errors.push(`${file.name}: Unsupported format. Please use JPEG, PNG, WebP, or GIF.`);
      return;
    }

    // Check file size
    if (file.size > BATCH_PROCESSING_LIMITS.maxFileSize) {
      errors.push(`${file.name}: File too large. Maximum size is ${BATCH_PROCESSING_LIMITS.maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    valid.push(file);
  });

  return { valid, errors };
}