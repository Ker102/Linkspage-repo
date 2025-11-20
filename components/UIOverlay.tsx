import React, { useRef } from 'react';
import { RotateCcw, X, Globe, Github, Linkedin, Instagram, ArrowRight } from 'lucide-react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export const UIOverlay: React.FC = () => {
  const scroll = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    // Get scroll progress (0 to 1)
    const scrollProgress = scroll.offset;
    let opacity = 0;

    // Sync with Wave appearance: Starts at 0.75, fully visible at 1.0
    if (scrollProgress > 0.75) {
        opacity = (scrollProgress - 0.75) / 0.25;
    }
    
    // Clamp opacity
    opacity = Math.min(Math.max(opacity, 0), 1);

    if (containerRef.current) {
        containerRef.current.style.opacity = opacity.toString();
        
        // Add a subtle entry animation (slide up slightly and scale in)
        const slideOffset = (1 - opacity) * 30; // 30px down when invisible
        const scale = 0.95 + (opacity * 0.05); // Scale from 0.95 to 1.0
        
        containerRef.current.style.transform = `translateY(${slideOffset}px) scale(${scale})`;
        
        // Disable pointer events when not fully visible to prevent accidental clicks during transition
        containerRef.current.style.pointerEvents = opacity > 0.8 ? 'auto' : 'none';
    }
  });

  const links = [
    { id: 1, label: 'Website', icon: Globe, href: '#' },
    { id: 2, label: 'GitHub', icon: Github, href: '#' },
    { id: 3, label: 'LinkedIn', icon: Linkedin, href: '#' },
    { id: 4, label: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col justify-between opacity-0 will-change-transform transition-opacity duration-0">
      {/* Top Navigation */}
      <div className="flex justify-end p-6 space-x-4">
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
        <div className="text-center mb-10 z-20">
           <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-4">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #FF3BFF 0%, #ECBFBF 38.02%, #5C24FF 75.83%, #D94FD5 100%)'
              }}
            >
              Portal to my stuff.
            </span>
          </h1>
          <p className="text-gray-400 text-lg font-light tracking-wide opacity-80">
            We turn complex ideas into effortless experiences
          </p>
        </div>

        {/* Glass Card Links Section */}
        <div className="w-full max-w-md perspective-1000">
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
      <div className="flex justify-center pb-8">
         <div className="px-4 py-2 rounded-full bg-black/20 border border-white/5 backdrop-blur-md text-[10px] md:text-xs text-gray-500 tracking-widest uppercase">
          Connect with me
        </div>
      </div>
    </div>
  );
};