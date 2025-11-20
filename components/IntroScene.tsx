import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

// Helper component for soft, ring-free gradient blobs
const SoftBlob: React.FC<{
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity?: number;
}> = ({ position, scale, color, opacity = 0.5 }) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Create a smooth radial gradient: solid center to transparent edge
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.NormalBlending}
        fog={false} // Critical: Ignore global black fog
      />
    </mesh>
  );
};

export const IntroScene: React.FC = () => {
  const scroll = useScroll();
  const groupRef = useRef<THREE.Group>(null);
  const bgGroupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Create a gradient texture to apply to the liquid blobs
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (context) {
        const gradient = context.createLinearGradient(0, 0, 512, 512); 
        gradient.addColorStop(0, '#FF3BFF');
        gradient.addColorStop(0.3, '#ECBFBF');
        gradient.addColorStop(0.6, '#5C24FF');
        gradient.addColorStop(1, '#D94FD5');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state, delta) => {
    const r1 = scroll.range(0, 0.5); // 0 to 1 during the first half of scroll
    
    // Transition Logic: Fade out logic
    const opacity = 1 - r1;
    const visible = opacity > 0.01;

    if (groupRef.current) {
        groupRef.current.visible = visible;
        groupRef.current.position.y = r1 * 8; 
        groupRef.current.scale.setScalar(1 + r1 * 0.2);
        
        // Fade out the liquid objects
        groupRef.current.children.forEach((child: any) => {
             // Handle nested groups for Float
             const target = child.isGroup ? child.children[0] : child;
             if (target && target.isGroup) {
                 // deeper nesting
                  target.children.forEach((c: any) => {
                      if (c.material) {
                         c.material.transparent = true;
                         c.material.opacity = opacity;
                      }
                  });
             } else if (target && target.material) {
                 target.material.transparent = true;
                 target.material.opacity = opacity;
             }
        });
    }

    if (bgGroupRef.current) {
        bgGroupRef.current.visible = visible;
        // Fade out the background elements
        bgGroupRef.current.children.forEach((child: any) => {
             if (child.material) {
                 // The base plane is index 0, keep it slightly simpler
                 child.material.opacity = opacity * (child.userData.baseOpacity || 1);
             }
        });
    }
  });

  return (
    <>
      {/* Background "Light World" Layer */}
      <group ref={bgGroupRef} position={[0, 0, -10]}>
         {/* 1. Infinite Solid White Base Plane */}
         {/* Scales massively to ensure no cutoff */}
         <mesh position={[0, 0, -1]} userData={{ baseOpacity: 1 }}>
             <planeGeometry args={[viewport.width * 10, viewport.height * 10]} />
             <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                depthWrite={false} 
                toneMapped={false} 
                fog={false} // Critical: Ignore global black fog
             />
         </mesh>

         {/* 2. Soft Gradient Blobs */}
         {/* Using the helper component to avoid rings */}
         <SoftBlob 
            position={[-viewport.width * 0.4, -viewport.height * 0.3, 0]} 
            scale={[viewport.width, viewport.width, 1]} 
            color="#FF9A9A" 
            opacity={0.6} 
         />
         <SoftBlob 
            position={[viewport.width * 0.4, -viewport.height * 0.4, 0]} 
            scale={[viewport.width * 1.2, viewport.width * 1.2, 1]} 
            color="#A78bFA" 
            opacity={0.5} 
         />
         <SoftBlob 
            position={[0, viewport.height * 0.1, 0.1]} 
            scale={[viewport.width * 0.8, viewport.width * 0.8, 1]} 
            color="#FBCFE8" 
            opacity={0.4} 
         />
          <SoftBlob 
            position={[viewport.width * 0.3, viewport.height * 0.4, 0]} 
            scale={[viewport.width * 0.9, viewport.width * 0.9, 1]} 
            color="#ECBFBF" 
            opacity={0.4} 
         />
      </group>

      {/* 3D Elements Group (Liquids) */}
      <group ref={groupRef}>
        <Environment preset="studio" />
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={1} />
        
        {/* Main Abstract Liquid */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={[-3.5, -0.5, 0]} rotation={[0.2, 0.2, 0]} scale={1.3}>
                 <mesh>
                    <sphereGeometry args={[1.2, 128, 128]} />
                    <MeshDistortMaterial 
                        map={gradientTexture}
                        envMapIntensity={1.2} 
                        clearcoat={1} 
                        clearcoatRoughness={0.1} 
                        metalness={0.1}
                        roughness={0.2}
                        distort={0.4} 
                        speed={3}
                        fog={false} // Critical: Ignore global black fog
                    />
                </mesh>
            </group>
        </Float>

        {/* Secondary Liquid Blob */}
        <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[5, 3, -2]} scale={1.0}>
                <sphereGeometry args={[0.8, 64, 64]} />
                <MeshDistortMaterial 
                    map={gradientTexture}
                    envMapIntensity={1} 
                    clearcoat={1} 
                    metalness={0.1}
                    roughness={0.2}
                    distort={0.5} 
                    speed={2}
                    fog={false} // Critical: Ignore global black fog
                />
            </mesh>
        </Float>

        {/* Tertiary Liquid Blob */}
         <Float speed={1} rotationIntensity={2} floatIntensity={0.5}>
            <mesh position={[4, -4, -1]} scale={0.7}>
                <sphereGeometry args={[0.8, 64, 64]} />
                <MeshDistortMaterial 
                    map={gradientTexture}
                    envMapIntensity={1} 
                    clearcoat={1} 
                    metalness={0.1}
                    roughness={0.2}
                    distort={0.6} 
                    speed={1.5}
                    fog={false} // Critical: Ignore global black fog
                />
            </mesh>
        </Float>
      </group>
    </>
  );
};
