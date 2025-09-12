import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getPostBySlug, getRelatedPosts } from '@/lib/blog';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | ImageToText Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.seo.title,
    description: post.seo.description,
    keywords: post.seo.keywords,
    openGraph: {
      title: post.seo.title,
      description: post.seo.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['ImageToText Team'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo.title,
      description: post.seo.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <span>•</span>
          <Link 
            href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="hover:text-primary transition-colors"
          >
            {post.category}
          </Link>
          <span>•</span>
          <span className="text-foreground">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {post.category}
            </Badge>
            {post.featured && (
              <Badge variant="default">
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl font-bold leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>
              Published on {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <Separator />

        {/* Article Content */}
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-muted-foreground leading-relaxed space-y-6">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <Separator />

        {/* Article Footer */}
        <footer className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Share this article:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/blog">
                ← Back to Blog
              </Link>
            </Button>
          </div>
        </footer>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6 pt-8 border-t">
            <h2 className="text-2xl font-bold">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.slug} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {relatedPost.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {relatedPost.readTime} min read
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {relatedPost.description.length > 100 
                        ? relatedPost.description.substring(0, 100) + '...' 
                        : relatedPost.description
                      }
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {relatedPost.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${relatedPost.slug}`} className="text-xs">
                        Read More →
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 mt-12">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Try OCR Technology?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Experience the power of AI-driven text extraction with our advanced OCR platform. 
              Start processing your images today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button asChild>
                <Link href="/">
                  Try OCR Now
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}