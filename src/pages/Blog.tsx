import { useNavigate } from "react-router-dom";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { format } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Blog = () => {
    const navigate = useNavigate();
    const { data: posts, isLoading } = useSanityQuery<any[]>('blog-posts', QUERIES.blogPosts);

    if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                <div className="mb-16">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight mb-6">
                        Helios Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Latest news, technical deep dives, and product updates from the Helios team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts?.map((post) => (
                        <div
                            key={post.slug.current}
                            className="group cursor-pointer border border-border bg-card rounded-xl overflow-hidden hover:border-primary transition-all duration-300"
                            onClick={() => navigate(`/blog/${post.slug.current}`)}
                        >
                            <div className="aspect-video overflow-hidden">
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
                                <div className="flex items-center gap-2 mb-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                                    <span>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</span>
                                    <span>•</span>
                                    <span>{post.author}</span>
                                </div>
                                <h3 className="text-xl font-heading font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                                    {post.excerpt}
                                </p>
                                <Button variant="link" className="p-0 text-primary h-auto group-hover:underline">
                                    Read more
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Blog;
