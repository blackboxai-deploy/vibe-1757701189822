import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | ImageToText OCR',
  description: 'Find answers to common questions about ImageToText OCR technology, supported formats, accuracy, pricing, and how our AI-powered text extraction works.',
  keywords: ['OCR FAQ', 'image to text questions', 'text extraction help', 'OCR accuracy', 'supported formats'],
  openGraph: {
    title: 'FAQ - ImageToText OCR Questions & Answers',
    description: 'Get answers to frequently asked questions about our AI-powered OCR technology and text extraction services.',
  },
};

const faqCategories = [
  {
    title: 'General Questions',
    icon: '❓',
    questions: [
      {
        question: 'What is ImageToText and how does it work?',
        answer: 'ImageToText is an AI-powered OCR (Optical Character Recognition) platform that converts images containing text into editable, searchable digital text. Our advanced AI models analyze your images and extract all visible text with high accuracy. Simply upload an image, and our system processes it within seconds to provide you with the extracted text.'
      },
      {
        question: 'Is ImageToText free to use?',
        answer: 'Yes! ImageToText is completely free to use. You can upload images, extract text, copy results, and download text files without any charges. We believe in making OCR technology accessible to everyone.'
      },
      {
        question: 'Do I need to create an account to use ImageToText?',
        answer: 'No account registration is required. You can start using ImageToText immediately without providing any personal information. Simply visit our website and begin uploading images for text extraction.'
      },
      {
        question: 'Is my data secure and private?',
        answer: 'Absolutely. We take privacy seriously. Your uploaded images are processed securely and are not stored permanently on our servers. All processing happens in real-time, and your data is automatically deleted after processing. We never share or sell your information to third parties.'
      }
    ]
  },
  {
    title: 'Technical Support',
    icon: '🔧',
    questions: [
      {
        question: 'What image formats are supported?',
        answer: 'ImageToText supports the most common image formats: JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), and GIF (.gif). These formats cover virtually all types of images you might want to process, from photos to screenshots to scanned documents.'
      },
      {
        question: 'What is the maximum file size allowed?',
        answer: 'You can upload images up to 10MB in size. This limit accommodates high-resolution images while ensuring fast processing times. If your image is larger, consider compressing it or reducing the resolution while maintaining text readability.'
      },
      {
        question: 'How accurate is the text extraction?',
        answer: 'Our AI-powered OCR technology achieves over 99.5% accuracy on clear, well-lit images with standard fonts. Accuracy may vary based on image quality, text size, font type, and lighting conditions. For best results, use high-resolution images with good contrast between text and background.'
      },
      {
        question: 'Can I process multiple images at once?',
        answer: 'Yes! Our batch processing feature allows you to upload and process up to 10 images simultaneously. This is perfect for processing multiple pages of a document or extracting text from several images at once. Results can be downloaded as combined or individual files.'
      }
    ]
  },
  {
    title: 'Features & Functionality',
    icon: '⚡',
    questions: [
      {
        question: 'What types of text can be extracted?',
        answer: 'ImageToText can extract various types of text including printed text, typed text, text in different fonts and sizes, and even some handwritten text. It works with documents, screenshots, photos of signs, business cards, receipts, and more. The AI is trained to recognize text in multiple languages and various contexts.'
      },
      {
        question: 'How long does processing take?',
        answer: 'Most images are processed within 2-5 seconds. Processing time depends on image size, complexity, and the amount of text present. Our advanced AI models are optimized for speed while maintaining high accuracy.'
      },
      {
        question: 'Can I edit the extracted text?',
        answer: 'Yes! Once text is extracted, it appears in an editable text area where you can make corrections, add notes, or modify the content as needed. You can then copy the text to your clipboard or download it as a text file.'
      },
      {
        question: 'What output formats are available?',
        answer: 'Extracted text can be copied to your clipboard, downloaded as a plain text (.txt) file, CSV format for structured data, or JSON format for developers. For batch processing, you can export all results as a combined file or individual files for each image.'
      }
    ]
  },
  {
    title: 'Quality & Optimization',
    icon: '🎯',
    questions: [
      {
        question: 'How can I improve text extraction accuracy?',
        answer: 'For best results: (1) Use high-resolution images with good contrast, (2) Ensure text is clearly visible and not blurry, (3) Avoid extreme angles or distortion, (4) Use good lighting without shadows over text, (5) Crop images to focus on the text area when possible.'
      },
      {
        question: 'Does ImageToText support different languages?',
        answer: 'Yes! Our AI models support text extraction in 50+ languages including English, Spanish, French, German, Chinese, Japanese, Arabic, Russian, and many more. The system automatically detects the language and applies appropriate recognition models.'
      },
      {
        question: 'Can it handle handwritten text?',
        answer: 'ImageToText can process some handwritten text, especially if it\'s clear and written in standard letter forms. However, printed and typed text generally achieve higher accuracy. For handwritten content, ensure the writing is legible and well-spaced for best results.'
      },
      {
        question: 'What about text in tables or structured layouts?',
        answer: 'Our AI is designed to handle structured text layouts including tables, columns, and formatted documents. The extraction attempts to preserve the logical flow and structure of the text. For complex tables, you may need to manually format the output.'
      }
    ]
  },
  {
    title: 'Troubleshooting',
    icon: '🛠️',
    questions: [
      {
        question: 'The extracted text contains errors. What should I do?',
        answer: 'Text extraction accuracy depends on image quality. If you encounter errors: (1) Try uploading a higher quality version of the image, (2) Ensure good lighting and contrast, (3) Check that text isn\'t too small or blurry, (4) Manually correct minor errors in the editable text area.'
      },
      {
        question: 'No text was detected in my image. Why?',
        answer: 'This can happen if: (1) The image doesn\'t contain readable text, (2) Text is too small or blurry, (3) Poor contrast between text and background, (4) Text is heavily distorted or at extreme angles, (5) The file format isn\'t supported. Try improving image quality or using a different image.'
      },
      {
        question: 'The website is loading slowly or not responding. What can I do?',
        answer: 'If you experience performance issues: (1) Check your internet connection, (2) Try refreshing the page, (3) Clear your browser cache, (4) Try using a different browser, (5) Reduce image file size if it\'s very large. If problems persist, contact our support team.'
      },
      {
        question: 'Can I use ImageToText on mobile devices?',
        answer: 'Absolutely! ImageToText is fully optimized for mobile devices. You can access all features on smartphones and tablets, including camera capture, drag-and-drop upload, and all processing features. The interface adapts perfectly to smaller screens.'
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about ImageToText OCR technology, 
            supported formats, and how our AI-powered text extraction works.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">99.5%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">50+</div>
            <div className="text-xs text-muted-foreground">Languages</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">10MB</div>
            <div className="text-xs text-muted-foreground">Max Size</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">&lt;5s</div>
            <div className="text-xs text-muted-foreground">Processing</div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                  <Badge variant="secondary" className="ml-auto">
                    {category.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <span className="font-medium">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Still Have Questions?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help. 
              Get in touch and we'll respond as quickly as possible.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="/instructions"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Instructions
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}