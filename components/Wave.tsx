import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createNoise3D } from 'simplex-noise';
import { useScroll } from '@react-three/drei';

const noise3D = createNoise3D();

interface WaveLineProps {
  index: number;
  totalLines: number;
  width: number;
  numPoints: number;
}

const WaveLineWithScroll: React.FC<WaveLineProps> = ({ index, totalLines, width, numPoints }) => {
    const scroll = useScroll();
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
    
    const scrollProgress = scroll.offset; // 0 to 1
    // Fade in logic: 0 opacity until 0.75, then fade to 1 by 1.0
    let globalOpacity = 0;
    if(scrollProgress > 0.75) {
        globalOpacity = (scrollProgress - 0.75) / 0.25;
    }

    if (globalOpacity <= 0.01) {
        lineRef.current.visible = false;
        return;
    }
    lineRef.current.visible = true;

    const time = clock.getElapsedTime();
    const geometry = lineRef.current.geometry;
    const positionAttribute = geometry.attributes.position;
    const colorAttribute = geometry.attributes.color;
    
    const c1 = new THREE.Color('#FF3BFF');
    const c2 = new THREE.Color('#ECBFBF');
    const c3 = new THREE.Color('#5C24FF');
    const c4 = new THREE.Color('#D94FD5');
    const tempColor = new THREE.Color();

    const zSpacing = 0.06; 
    const zOffset = (index - totalLines / 2) * zSpacing;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const x = (t - 0.5) * width;
      
      const speed = 0.15; 
      const noiseScale = 0.15; 
      
      const flow = Math.sin(x * 0.3 + time * speed + zOffset * 1.5);
      const secondaryFlow = Math.cos(x * 0.2 - time * 0.1);
      const noise = noise3D(x * noiseScale, zOffset * 0.5, time * 0.1);
      
      const taper = Math.sin(t * Math.PI);
      const amplitude = 1.5;
      const y = (flow + secondaryFlow * 0.5 + noise) * amplitude * taper;
      const z = zOffset + Math.sin(x * 0.5 + time * 0.2) * 0.3 * taper;

      positionAttribute.setXYZ(i, x, y - 2.0, z); 

      // Gradient Logic
      const colorPhase = (Math.sin(x * 0.15 + time * 0.3) + 1) / 2; 
      if (colorPhase < 0.38) {
        const localT = colorPhase / 0.38;
        tempColor.lerpColors(c1, c2, localT);
      } else if (colorPhase < 0.758) {
        const localT = (colorPhase - 0.38) / (0.758 - 0.38);
        tempColor.lerpColors(c2, c3, localT);
      } else {
        const localT = (colorPhase - 0.758) / (1.0 - 0.758);
        tempColor.lerpColors(c3, c4, localT);
      }

      const fadeOutEdges = taper; 
      const finalOpacity = fadeOutEdges * globalOpacity;

      colorAttribute.setXYZ(
        i, 
        tempColor.r * finalOpacity, 
        tempColor.g * finalOpacity, 
        tempColor.b * finalOpacity
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
        <WaveLineWithScroll
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