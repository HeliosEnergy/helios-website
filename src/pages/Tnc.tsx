import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortableTextRenderer } from "@/components/blog/PortableTextRenderer";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

interface TncData {
  title: string;
  lastUpdated: string;
  content: any[]; // PortableText blocks
}

const Tnc = () => {
  const { data: tncData, isLoading, error } = useSanityQuery<TncData>('legal-page', QUERIES.legalPage);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="animate-pulse">
            <div className="h-12 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Content</h1>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight leading-[1.1] mb-4">
              {tncData?.title}
            </h1>
            <p className="text-muted-foreground">
              Last updated: {tncData?.lastUpdated ? new Date(tncData.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Loading...'}
            </p>
          </header>

          <div className="prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground">
            {tncData?.content && <PortableTextRenderer value={tncData.content} />}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default Tnc;