import { ArrowRight, BookOpen, FileCode, Terminal, List, Twitter, Youtube, Linkedin, MessageCircle } from "lucide-react";

export const DevelopersDropdown = () => {
  return (
    <div className="flex gap-0 p-0 min-w-[1000px] bg-transparent">
      {/* Developer Toolkit */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Toolkit
          </h3>
          <p className="text-xl text-white/60 leading-relaxed font-light">
            Build, evaluate, <br />and scale.
          </p>
        </div>
        
        <div className="space-y-6">
          <a href="#" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            SDK
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            EvalProtocol
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            Voice Agent
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </div>

      {/* Documentation & Lifecycle */}
      <div className="flex-[1.2] p-12 bg-white/[0.02] space-y-12">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
            Resources
          </h3>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            {[
              { icon: BookOpen, label: "Docs" },
              { icon: FileCode, label: "API Reference" },
              { icon: Terminal, label: "CLI Tool" },
              { icon: List, label: "Changelog" },
            ].map((item) => (
              <a key={item.label} href="#" className="flex items-center gap-4 text-sm text-white/50 hover:text-white transition-colors group">
                <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                {item.label}
              </a>
            ))}
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5">
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Lifecycle
          </h3>
          <div className="flex gap-12">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-4">Build</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">LLMs</a>
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">Multimodal</a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-4">Tune</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">SFT</a>
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">RFT</a>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-white/50 mb-4">Scale</h4>
              <div className="space-y-2">
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">Serverless</a>
                <a href="#" className="block text-xs text-white/60 hover:text-white transition-colors">Reserved</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Further */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">Community</span>
            <p className="text-sm text-white/60 leading-relaxed">
              Join the architects of the next intelligence frontier.
            </p>
          </div>
          
          <div className="flex gap-2">
            {[
              { label: "Twitter", Icon: Twitter },
              { label: "YouTube", Icon: Youtube },
              { label: "LinkedIn", Icon: Linkedin },
              { label: "Community Chat", Icon: MessageCircle },
            ].map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="text-white/50 hover:text-white transition-all transform hover:scale-110 inline-flex items-center justify-center w-11 h-11"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        
        <a
          href="#"
          className="mt-12 block w-full py-4 bg-white text-black text-center text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/90 transition-all hover:scale-[1.02]"
        >
          Get Started
        </a>
      </div>
    </div>
  );
};
