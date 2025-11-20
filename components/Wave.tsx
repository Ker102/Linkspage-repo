import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

interface WaveLineProps {
  index: number;
  totalLines: number;
  width: number;
  numPoints: number;
}

const WaveLine: React.FC<WaveLineProps> = ({ index, totalLines, width, numPoints }) => {
  const lineRef = useRef<THREE.Line>(null);
  
  // Initialize buffers
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);
    for(let i=0; i<numPoints*3; i++) {
        positions[i] = 0;
        colors[i] = 1; 
    }
    return { positions, colors };
  }, [numPoints]);

  useFrame(({ clock }) => {
    if (!lineRef.current) return;

    const time = clock.getElapsedTime();
    const geometry = lineRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const colorAttribute = geometry.attributes.color;
    
    // Define gradient colors
    const c1 = new THREE.Color('#60a5fa'); // Blue-400
    const c2 = new THREE.Color('#818cf8'); // Indigo-400
    const c3 = new THREE.Color('#e879f9'); // Fuchsia-400
    const tempColor = new THREE.Color();

    // Compactness: Reduce the spacing between lines
    const zSpacing = 0.06; 
    const zOffset = (index - totalLines / 2) * zSpacing;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const x = (t - 0.5) * width;
      
      // Wave parameters
      const speed = 0.15; // Slightly slower for elegance
      const noiseScale = 0.15; 
      
      const flow = Math.sin(x * 0.3 + time * speed + zOffset * 1.5);
      const secondaryFlow = Math.cos(x * 0.2 - time * 0.1);
      const noise = noise3D(x * noiseScale, zOffset * 0.5, time * 0.1);
      
      // Envelope/Taper
      const taper = Math.sin(t * Math.PI);
      
      // Calculate Height (Y)
      const amplitude = 1.5;
      const y = (flow + secondaryFlow * 0.5 + noise) * amplitude * taper;

      // Calculate Depth (Z)
      const z = zOffset + Math.sin(x * 0.5 + time * 0.2) * 0.3 * taper;

      // Shift down but slightly higher than before so it's behind the central card
      // Previous was -3.5, now -2.5 to bring it up behind the glass UI
      positionAttribute.setXYZ(i, x, y - 2.5, z); 

      // --- Dynamic Gradient Logic ---
      const colorPhase = (Math.sin(x * 0.15 + time * 0.3) + 1) / 2; 
      
      if (colorPhase < 0.5) {
        tempColor.lerpColors(c1, c2, colorPhase * 2);
      } else {
        tempColor.lerpColors(c2, c3, (colorPhase - 0.5) * 2);
      }

      // Fade out edges
      const opacity = taper; 
      const intensity = 0.8 * opacity;

      colorAttribute.setXYZ(
        i, 
        tempColor.r * intensity, 
        tempColor.g * intensity, 
        tempColor.b * intensity
      );
    }
    
    positionAttribute.needsUpdate = true;
    colorAttribute.needsUpdate = true;
  });

  return (
    <line ref={lineRef as any}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={numPoints} itemSize={3} array={positions} />
        <bufferAttribute attach="attributes-color" count={numPoints} itemSize={3} array={colors} />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
};

export const WaveScene: React.FC = () => {
  const numLines = 64; 
  const lines = useMemo(() => new Array(numLines).fill(0).map((_, i) => i), []);

  return (
    <group rotation={[0.1, 0, 0]}>
      {lines.map((i) => (
        <WaveLine
          key={i}
          index={i}
          totalLines={numLines}
          width={32} 
          numPoints={128}
        />
      ))}
    </group>
  );
};