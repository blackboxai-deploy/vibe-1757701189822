'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { downloadBatchResults, calculateBatchProgress } from '@/lib/multi-processing';
import { copyToClipboard } from '@/lib/imageUtils';
import type { ProcessingQueueItem, ExtractionResult } from '@/types/extraction';

interface BatchResultsProps {
  queue: ProcessingQueueItem[];
  onClearResults: () => void;
}

export default function BatchResults({ queue, onClearResults }: BatchResultsProps) {
  const [exportFormat, setExportFormat] = useState<'txt' | 'csv' | 'json'>('txt');
  const [copySuccess, setCopySuccess] = useState(false);

  const batchState = calculateBatchProgress(queue);
  const completedResults = queue
    .filter(item => item.status === 'completed' && item.result)
    .map(item => item.result!);

  const failedItems = queue.filter(item => item.status === 'failed');

  const handleCopyAll = async () => {
    if (completedResults.length === 0) return;

    const allText = completedResults
      .map((result, index) => `=== File ${index + 1}: ${result.fileName} ===\n${result.text}`)
      .join('\n\n');
    
    const success = await copyToClipboard(allText);
    setCopySuccess(success);
    
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleCopySingle = async (text: string) => {
    const success = await copyToClipboard(text);
    setCopySuccess(success);
    
    if (success) {
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleExportAll = () => {
    if (completedResults.length === 0) return;
    downloadBatchResults(completedResults, exportFormat);
  };

  if (batchState.totalItems === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
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
          <h3 className="text-lg font-semibold mb-2">No batch results yet</h3>
          <p className="text-sm text-muted-foreground">
            Upload multiple images to see batch processing results here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Batch Results
            <Badge variant="secondary" className="text-xs">
              {batchState.completedItems}/{batchState.totalItems}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {batchState.completedItems > 0 && (
              <>
                <Select value={exportFormat} onValueChange={(value: 'txt' | 'csv' | 'json') => setExportFormat(value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="txt">TXT</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExportAll}
                  className="flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </Button>
              </>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearResults}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{batchState.completedItems}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{batchState.failedItems}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{batchState.totalItems}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Results Tabs */}
        <Tabs defaultValue="completed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="completed" disabled={batchState.completedItems === 0}>
              Completed ({batchState.completedItems})
            </TabsTrigger>
            <TabsTrigger value="failed" disabled={batchState.failedItems === 0}>
              Failed ({batchState.failedItems})
            </TabsTrigger>
            <TabsTrigger value="combined" disabled={batchState.completedItems === 0}>
              Combined Text
            </TabsTrigger>
          </TabsList>

          {/* Completed Results */}
          <TabsContent value="completed" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Successfully extracted text from {batchState.completedItems} images
              </p>
              {batchState.completedItems > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopyAll}
                  className={`flex items-center gap-2 ${copySuccess ? 'text-green-600' : ''}`}
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy All
                    </>
                  )}
                </Button>
              )}
            </div>
            
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {completedResults.map((result, index) => (
                  <div key={result.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{result.fileName}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span>{result.text.length} characters</span>
                          <span>•</span>
                          <span>{(result.processingTime / 1000).toFixed(1)}s</span>
                          <span>•</span>
                          <span>{result.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCopySingle(result.text)}
                      >
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={result.text}
                      readOnly
                      className="min-h-[100px] text-sm resize-none"
                      placeholder="No text detected"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Failed Results */}
          <TabsContent value="failed" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {batchState.failedItems} images failed to process
            </p>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {failedItems.map((item) => (
                  <div key={item.id} className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{item.file.name}</h4>
                        <p className="text-sm text-destructive mt-1">{item.error || 'Processing failed'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Combined Text */}
          <TabsContent value="combined" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Combined text from all successfully processed images
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopyAll}
                className={`flex items-center gap-2 ${copySuccess ? 'text-green-600' : ''}`}
              >
                {copySuccess ? 'Copied!' : 'Copy All'}
              </Button>
            </div>
            <Textarea
              value={completedResults
                .map((result, index) => `=== File ${index + 1}: ${result.fileName} ===\n${result.text}`)
                .join('\n\n')}
              readOnly
              className="min-h-[400px] text-sm resize-none"
              placeholder="No combined text available"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}