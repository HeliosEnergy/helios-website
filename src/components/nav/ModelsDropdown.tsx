import { Sparkles, Server, Brain, Image, AudioLines, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSanityQuery } from "@/hooks/useSanityData";
import { urlFor } from "@/lib/sanity";

export const ModelsDropdown = () => {
  const { data: sectionData } = useSanityQuery<any>(
    'models-section-nav',
    `*[_type == "modelsSection"][0] {
       models[]-> {
        _id,
        name,
        slug,
        provider,
        icon,
        iconFilename,
        initial
      }
    }`
  );

  const models = sectionData?.models || [];

  return (
    <div className="flex gap-0 p-0 min-w-[1000px] bg-transparent">
      {/* Model Types */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Classification
          </h3>
          <p className="text-xl text-white/80 leading-relaxed font-light">
            The right architecture <br />for the task.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
           {[
             { icon: Sparkles, label: "Featured", filter: "featured" },
             { icon: Brain, label: "LLM", filter: "LLM" },
             { icon: Eye, label: "Vision", filter: "Vision" },
             { icon: Image, label: "Image", filter: "Image" },
             { icon: AudioLines, label: "Audio", filter: "Audio" },
             { icon: Server, label: "Serverless", filter: "serverless" },
           ].map((item) => (
             <Link key={item.label} to={`/model-library?filter=${item.filter}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group">
               <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
               {item.label}
             </Link>
           ))}
        </div>
      </div>

      {/* Featured Providers */}
      <div className="flex-1 p-12 bg-white/[0.02] space-y-10">
        <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
          The Ecosystem
        </h3>
        <div className="grid grid-cols-1 gap-y-4">
           {models.slice(0, 6).map((model: any) => {
             const iconUrl = model.icon ? urlFor(model.icon).width(40).height(40).url() : model.iconFilename ? `/model-lib/${model.iconFilename}` : null;
             
             return (
               <Link 
                 key={model._id} 
                 to={`/model-library/${model.slug?.current}`} 
                 className="flex items-center gap-4 text-sm text-white/80 hover:text-white group transition-colors"
               >
                 <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                   {iconUrl ? (
                     <img
                       src={iconUrl}
                       alt={`${model.name} logo`}
                       className="w-5 h-5 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                       onError={(e) => {
                         const target = e.currentTarget;
                         target.style.display = 'none';
                         target.nextElementSibling?.classList.remove('hidden');
                       }}
                     />
                   ) : null}
                   <div className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white/40 bg-white/5 rounded-sm ${iconUrl ? 'hidden' : ''}`}>
                     {model.initial || model.name?.charAt(0)}
                   </div>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-[#FF6B35] transition-colors leading-none mb-1">
                     {model.provider}
                   </span>
                   <span className="font-medium tracking-tight">{model.name}</span>
                 </div>
               </Link>
             );
           })}
        </div>
      </div>

      {/* 400+ Models Supported */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">Library</span>
            <h4 className="text-4xl font-heading font-bold tracking-tighter text-white">5+</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Models supported with <br />optimized inference.
            </p>
          </div>
        </div>
        
        <a
          href="/model-library"
          className="mt-12 block w-full py-4 bg-white text-black text-center text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/90 transition-all hover:scale-[1.02]"
        >
          Explore All
        </a>
      </div>
    </div>
  );
};