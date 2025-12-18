import { ArrowRight } from "lucide-react";

const posts = [
  {
    date: "10/20/2025",
    title: "Fireworks and AMD partner to power the next gen of AI infrastructure",
    image: "from-orange-400 to-red-500",
  },
  {
    date: "10/15/2025",
    title: "LLM on the edge: Model picking with Fireworks Eval Protocol + Ollama",
    image: "from-blue-400 to-cyan-500",
  },
  {
    date: "10/9/2025",
    title: "Announcing Embeddings and Reranking On Fireworks AI",
    image: "from-purple-400 to-pink-500",
  },
];

export const BlogSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-10">
          What's new in our blog
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <a
              key={i}
              href="#"
              className="group block"
            >
              {/* Image */}
              <div className={`h-44 rounded-xl bg-gradient-to-br ${post.image} relative overflow-hidden mb-4`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              
              {/* Content */}
              <p className="text-sm text-muted-foreground mb-2">
                {post.date}
              </p>
              <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                {post.title}
              </h3>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
