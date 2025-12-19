import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { format } from "date-fns";

export const BlogSection = () => {
  const navigate = useNavigate();
  const { data: sectionData } = useSanityQuery<any>('blog-section', `*[_type == "blogSection"][0]`);
  const { data: posts, isLoading } = useSanityQuery<any[]>('home-blog-posts', `*[_type == "blogPost"] | order(publishedAt desc)[0...3] {
    title,
    slug,
    publishedAt,
    heroImage,
    "author": author->name
  }`);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-sm font-mono uppercase tracking-widest text-primary">
              {sectionData?.label || 'Blog'}
            </span>
            <h2 className="mt-3 text-4xl font-heading font-bold text-foreground tracking-tight">
              {sectionData?.heading || 'Latest insights and updates'}
            </h2>
          </div>
          <Button variant="outline" className="gap-2 group" onClick={() => navigate('/blog')}>
            View all articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted aspect-video rounded-xl" />
            ))
          ) : (
            posts?.map((post) => (
              <div
                key={post.slug.current}
                className="group cursor-pointer rounded-xl overflow-hidden border border-border bg-card hover:border-primary transition-all duration-300"
                onClick={() => navigate(`/blog/${post.slug.current}`)}
              >
                <div className="aspect-video overflow-hidden border-b border-border">
                  {post.heroImage ? (
                    <img
                      src={urlFor(post.heroImage).url()}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    <span>{format(new Date(post.publishedAt), 'MMM dd')}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
