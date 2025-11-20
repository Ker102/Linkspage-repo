import React from 'react';
import { RotateCcw, X, Globe, Github, Linkedin, Instagram, ArrowRight } from 'lucide-react';

export const UIOverlay: React.FC = () => {
  const links = [
    { id: 1, label: 'Website', icon: Globe, href: '#' },
    { id: 2, label: 'GitHub', icon: Github, href: '#' },
    { id: 3, label: 'LinkedIn', icon: Linkedin, href: '#' },
    { id: 4, label: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none">
      {/* Top Navigation */}
      <div className="flex justify-end p-6 space-x-4 pointer-events-auto">
        <button className="p-2 text-white/50 hover:text-white transition-colors rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-white/10">
          <RotateCcw size={16} />
        </button>
        <button className="p-2 text-white/50 hover:text-white transition-colors rounded-full border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-white/10">
          <X size={16} />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 -mt-10 w-full">
        
        {/* Header Section */}
        <div className="text-center mb-10 pointer-events-auto z-20">
           <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #FF3BFF 0%, #ECBFBF 38.02%, #5C24FF 75.83%, #D94FD5 100%)'
              }}
            >
              Clarity. Focus. Impact.
            </span>
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide opacity-80">
            We turn complex ideas into effortless experiences
          </p>
        </div>

        {/* Glass Card Links Section */}
        <div className="w-full max-w-md pointer-events-auto perspective-1000">
          {/* The Glass Container */}
          <div className="relative rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(100,100,255,0.25)] group border border-white/10 bg-gray-900/30 backdrop-blur-xl">
            
            {/* Subtle inner glow/gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="relative p-6 flex flex-col gap-3">
              {links.map((link) => (
                <a 
                  key={link.id}
                  href={link.href}
                  className="group/item relative flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-center space-x-4 z-10">
                    <div className="p-2.5 rounded-xl bg-black/20 text-white/80 group-hover/item:text-white group-hover/item:bg-black/40 transition-colors shadow-inner">
                      <link.icon size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-white/90 font-medium tracking-wide text-sm md:text-base">
                      {link.label}
                    </span>
                  </div>
                  
                  <div className="text-white/20 group-hover/item:text-white/80 group-hover/item:translate-x-1 transition-all z-10">
                    <ArrowRight size={16} strokeWidth={2} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex justify-center pb-8 pointer-events-auto">
         <div className="px-4 py-2 rounded-full bg-black/20 border border-white/5 backdrop-blur-md text-[10px] md:text-xs text-gray-500 tracking-widest uppercase">
          Connect with me
        </div>
      </div>
    </div>
  );
};