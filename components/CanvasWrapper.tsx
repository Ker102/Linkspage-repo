import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { WaveScene } from './Wave';
import { Environment, OrbitControls } from '@react-three/drei';

export const CanvasWrapper: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        dpr={[1, 2]} // Handle high DPI screens
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#000000']} />
          <fog attach="fog" args={['#000000', 5, 25]} /> {/* Fade out distance */}
          
          <WaveScene />
          
          {/* Subtle ambient light, though the lines are self-illuminated via BasicMaterial */}
          <ambientLight intensity={0.5} />
          
          {/* Orbit controls for the 'interactive' requirement, but constrained */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            minPolarAngle={Math.PI / 3} 
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};