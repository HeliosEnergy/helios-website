import { Code2, MessageSquare, Brain, Search, Image, Database, ArrowRight } from "lucide-react";

const useCases = [
  {
    icon: Code2,
    title: "Code Assistance",
    description: "IDE copilots, code generation, debugging agents",
  },
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description: "Customer support bots, internal helpdesk assistants, multilingual chat",
  },
  {
    icon: Brain,
    title: "Agentic Systems",
    description: "Multi-step reasoning, planning, and execution pipelines",
  },
  {
    icon: Search,
    title: "Search",
    description: "Enterprise assistants, summarization, semantic search, personalized recommendations",
  },
  {
    icon: Image,
    title: "Multimedia",
    description: "Text, vision, and speech in real-time workflows",
  },
  {
    icon: Database,
    title: "Enterprise RAG",
    description: "Secure, scalable retrieval for knowledge bases and documents",
  },
];

export const UseCasesSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Fireworks AI Cloud
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground">
            What Can You Build on Fireworks
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From experimentation to production, Fireworks provides the platform to build your Generative AI capabilities - optimized and at scale
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <div
              key={useCase.title}
              className="group relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <useCase.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground text-sm flex-grow">
                  {useCase.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
