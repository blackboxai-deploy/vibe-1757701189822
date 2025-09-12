import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllPosts, getFeaturedPosts, blogCategories } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'OCR Blog - Latest AI Text Extraction Insights | ImageToText',
  description: 'Stay updated with the latest OCR technology trends, AI advances, and text extraction techniques. Expert insights on document processing and automation.',
  keywords: ['OCR blog', 'AI text extraction', 'document processing blog', 'OCR technology news', 'text recognition insights'],
  openGraph: {
    title: 'OCR Technology Blog | AI Text Extraction Insights',
    description: 'Discover the latest in OCR technology, AI advances, and document processing automation. Expert insights and practical guides.',
  },
};

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getAllPosts().slice(0, 9);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OCR Technology Blog
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with the latest advances in AI-powered text extraction, 
            document processing automation, and OCR technology insights.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search articles..."
              className="pl-10"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Featured Articles</h2>
              <Badge variant="secondary">Editor's Pick</Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.slug} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.readTime} min read
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read More →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {blogCategories.map((category) => (
              <Card key={category.slug} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center space-y-3">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    <Link href={`/blog/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {category.postCount} articles
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Articles */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Articles</h2>
            <Button variant="outline" asChild>
              <Link href="/blog/all">
                View All Articles
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card key={post.slug} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {post.readTime} min read
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.description.length > 120 
                      ? post.description.substring(0, 120) + '...' 
                      : post.description
                    }
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`} className="text-xs">
                        Read More →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Get the latest OCR technology insights, tutorials, and industry news 
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Join 10,000+ professionals staying ahead of OCR technology trends
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}