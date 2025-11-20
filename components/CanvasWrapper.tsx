import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { WaveScene } from './Wave';
import { IntroScene } from './IntroScene';
import { ScrollControls, Scroll } from '@react-three/drei';
import { UIOverlay } from './UIOverlay';
import { RotateCcw, X, ChevronDown } from 'lucide-react';

export const CanvasWrapper: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 35 }}
        dpr={[1, 2]} 
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Base background is black for the Wave scene. The IntroScene will overlay a white world on top initially. */}
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 10, 40]} />
          
          <ambientLight intensity={0.8} />

          <ScrollControls pages={2} damping={0.2}>
             {/* 3D Content */}
             <IntroScene />
             <WaveScene />

             {/* HTML Overlay Content */}
             <Scroll html style={{ width: '100%', height: '100%' }}>
                
                {/* Page 1: Intro */}
                <section className="w-screen h-screen relative flex flex-col items-center justify-center pointer-events-none">
                    
                    {/* Top Right Buttons (Visual only based on screenshot) */}
                    <div className="absolute top-8 right-8 flex gap-3 z-50 pointer-events-auto">
                        <button className="w-10 h-10 rounded-full border border-black/10 bg-white/50 backdrop-blur-md flex items-center justify-center text-black/70 hover:bg-white hover:scale-110 transition-all shadow-sm">
                            <RotateCcw size={16} strokeWidth={1.5} />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-black/10 bg-white/50 backdrop-blur-md flex items-center justify-center text-black/70 hover:bg-white hover:scale-110 transition-all shadow-sm">
                            <X size={16} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Main Title Content */}
                    <div className="relative z-10 text-center flex flex-col items-center transform -translate-y-12">
                        {/* Top Tagline with Gradient */}
                        <h3 
                            className="font-medium tracking-[0.2em] text-xs md:text-sm uppercase mb-2 bg-clip-text text-transparent"
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #FF3BFF 0%, #ECBFBF 38.02%, #5C24FF 75.83%, #D94FD5 100%)'
                            }}
                        >
                            Where creators and brands discover eachother
                        </h3>

                        {/* Big Typography */}
                        <div className="relative leading-[0.85] select-none font-sans">
                            <h1 className="text-[15vw] md:text-[180px] font-black text-[#1a1a1a] tracking-tighter">
                                KAELUX
                            </h1>
                        </div>

                        {/* Scroll Down Indicator */}
                        <div className="mt-16 flex flex-col items-center animate-bounce opacity-60">
                            <span className="text-black font-bold tracking-widest text-[10px] uppercase mb-2">Scroll down</span>
                            <ChevronDown size={20} className="text-black" />
                        </div>
                    </div>

                    {/* Bottom Hint */}
                    <div className="absolute bottom-12 w-full flex justify-center z-10">
                         <p className="text-black/30 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium animate-pulse">
                            Press on the canvas to focus and interact
                        </p>
                    </div>
                </section>

                {/* Page 2: Main Interface (Existing) */}
                <section style={{ height: '100vh', width: '100vw', position: 'relative' }}>
                  <UIOverlay />
                </section>
             </Scroll>
          </ScrollControls>
          
        </Suspense>
      </Canvas>
    </div>
  );
};
