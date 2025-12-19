import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/blog/Breadcrumb";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";

const BlogPost = () => {
    const { slug } = useParams();
    const { data: post, isLoading } = useSanityQuery<any>('blog-post', QUERIES.blogPost, { slug });

    if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
    if (!post) return <div className="min-h-screen bg-background flex items-center justify-center">Post not found</div>;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
                <Breadcrumb
                    items={[
                        { label: 'Blog', href: '/blog' },
                        { label: post.title }
                    ]}
                />

                <div className="lg:pl-[240px] xl:pl-[336px]">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.1] mb-6">
                        {post.title}
                    </h1>
                    <div className="text-sm font-mono text-muted-foreground uppercase tracking-[0.2em] mb-12">
                        Published {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </div>

                    {post.heroImage && (
                        <div className="w-full aspect-[2/1] rounded-2xl overflow-hidden mb-16 border border-border">
                            <img
                                src={urlFor(post.heroImage).url()}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            <BlogPostLayout aside={<TableOfContents content={post.body} />}>
                <div className="max-w-3xl">
                    <PortableTextRenderer value={post.body} />

                    <div className="mt-20 pt-10 border-t border-border flex items-start gap-6">
                        {post.author?.image && (
                            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border border-border">
                                <img
                                    src={urlFor(post.author.image).width(128).height(128).url()}
                                    alt={post.author.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div>
                            <h4 className="text-lg font-bold text-foreground mb-2">Written by {post.author.name}</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {post.author.bio}
                            </p>
                        </div>
                    </div>
                </div>
            </BlogPostLayout>

            <Footer />
        </div>
    );
};

export default BlogPost;
