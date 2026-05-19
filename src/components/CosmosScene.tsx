import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Html, useCursor, Grid } from '@react-three/drei';
import { useState, useRef } from 'react';
import * as THREE from 'three';
import { particlesData, ParticleData } from '../data/particles';
import { CustomControls } from './CustomControls';
import { useLanguage } from '../store/LanguageContext';

function Particle({ data }: { data: ParticleData }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();
  const groupRef = useRef<THREE.Group>(null);

  useCursor(hovered, 'pointer', 'auto');

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group position={data.position}>
      <mesh
        ref={groupRef}
        onClick={() => window.open(data.url, '_blank')}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[hovered ? 0.8 : 0.4, 32, 32]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 3 : 1.5}
          toneMapped={false}
        />
        {/* Glow effect */}
        <mesh scale={hovered ? 1.5 : 1.2}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color={data.color}
            emissive={data.color}
            emissiveIntensity={hovered ? 2 : 0.5}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      </mesh>
      
      {/* HTML Overlay anchored to the mesh */}
      {hovered && (
        <Html distanceFactor={15} center zIndexRange={[100, 0]}>
          <div className="w-64 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden pointer-events-none shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all">
            <div className="relative p-5 border-b border-white/10 bg-slate-900 flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 pointer-events-none"></div>
              <div className="relative z-10 bg-black/50 border border-white/20 rounded-lg p-3 w-full backdrop-blur-sm">
                <div className="text-[10px] text-cyan-400 font-mono mb-1 uppercase tracking-widest">{t('previewing')}</div>
                <div className="font-bold text-white text-base tracking-wide" style={{ color: data.color }}>{data.title}</div>
              </div>
            </div>
            <div className="p-4 bg-slate-950 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-slate-400">{t('destination')}</span>
              </div>
              <div className="text-[11px] text-white/70 font-mono break-all leading-relaxed">{data.url}</div>
              <div className="mt-2 flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t('nodeStatus')}</span>
                <span className="text-[10px] font-mono text-cyan-400">{t('stable')}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export function CosmosScene() {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#030712]">
      <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
        {/* Scene Environment */}
        <color attach="background" args={['#030712']} />
        <fog attach="fog" args={['#030712', 10, 100]} />
        <ambientLight intensity={0.5} />
        
        {/* Generates a cosmic background of stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade speed={1} />

        {/* Render all exhibition particles */}
        {particlesData.map((p, i) => (
          <Particle key={i} data={p} />
        ))}

        {/* Orbit + Flight Controls */}
        <CustomControls />
      </Canvas>
    </div>
  );
}
