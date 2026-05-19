import { Canvas, useFrame } from '@react-three/fiber';
import { Html, useCursor } from '@react-three/drei';
import { useMemo, useState, useRef } from 'react';
import * as THREE from 'three';
import { particlesData, ParticleData } from '../data/particles';
import { CustomControls } from './CustomControls';
import { useLanguage } from '../store/LanguageContext';

const WHITE = '#f8fbff';

function createNoteTexture(symbol: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 256, 256);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '900 156px "Arial Unicode MS", "Times New Roman", Georgia, serif';

  for (const blur of [34, 22, 12]) {
    ctx.shadowColor = 'rgba(245, 249, 255, 1)';
    ctx.shadowBlur = blur;
    ctx.fillStyle = 'rgba(245, 249, 255, 0.28)';
    ctx.fillText(symbol, 128, 126);
  }

  ctx.shadowBlur = 10;
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = 3;
  ctx.strokeText(symbol, 128, 126);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(symbol, 128, 126);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createStarTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 58);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.18, 'rgba(255,255,255,0.95)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(255,255,255,0.95)';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 16;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(64, 4);
  ctx.lineTo(64, 124);
  ctx.moveTo(4, 64);
  ctx.lineTo(124, 64);
  ctx.stroke();
  return new THREE.CanvasTexture(canvas);
}

function Particle({ data }: { data: ParticleData }) {
  const [hovered, setHovered] = useState(false);
  const { t } = useLanguage();
  const spriteRef = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => createNoteTexture(data.symbol), [data.symbol]);

  useCursor(hovered, 'pointer', 'auto');

  useFrame(({ clock }) => {
    if (spriteRef.current) {
      const time = clock.elapsedTime;
      spriteRef.current.position.y = Math.sin(time * data.drift + data.position[0]) * (0.34 + data.depth * 0.42);
      spriteRef.current.material.rotation = data.rotation + Math.sin(time * 0.35 + data.position[2]) * 0.08;
    }
  });

  return (
    <group position={data.position}>
      <sprite
        ref={spriteRef}
        scale={[hovered ? data.scale * 1.18 : data.scale, hovered ? data.scale * 1.18 : data.scale, 1]}
        onClick={() => window.open(data.url, '_blank')}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <spriteMaterial
          map={texture}
          color={WHITE}
          transparent
          opacity={hovered ? 1 : 0.9 - data.depth * 0.48}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
      
      {/* HTML Overlay anchored to the mesh */}
      {hovered && (
        <Html distanceFactor={15} center zIndexRange={[100, 0]}>
          <div className="w-64 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden pointer-events-none shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all">
            <div className="relative p-5 border-b border-white/10 bg-slate-900 flex flex-col items-center justify-center text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 pointer-events-none"></div>
              <div className="relative z-10 bg-black/50 border border-white/20 rounded-lg p-3 w-full backdrop-blur-sm">
                <div className="text-[10px] text-cyan-400 font-mono mb-1 uppercase tracking-widest">{t('previewing')}</div>
                <div className="font-bold text-white text-base tracking-wide">{data.title}</div>
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

function SparkleField() {
  const texture = useMemo(createStarTexture, []);
  const stars = useMemo(() => {
    return Array.from({ length: 34 }).map((_, i) => {
      const x = -28 + ((i * 13) % 56);
      const y = -5 + ((i * 19) % 34);
      const z = -14 + ((i * 17) % 22);
      return {
        position: [x, y, z] as [number, number, number],
        scale: 0.35 + (i % 5) * 0.18,
        rotation: (i % 7) * 0.35,
      };
    });
  }, []);

  return (
    <>
      {stars.map((star, i) => (
        <sprite key={i} position={star.position} scale={[star.scale, star.scale, 1]}>
          <spriteMaterial
            map={texture}
            rotation={star.rotation}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      ))}
    </>
  );
}

function GroundDust() {
  const { fine, bright } = useMemo(() => {
    const fineCount = 18000;
    const finePositions = new Float32Array(fineCount * 3);
    for (let i = 0; i < fineCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.28) * 380;
      finePositions[i * 3] = Math.cos(angle) * radius;
      finePositions[i * 3 + 1] = -12.2 + Math.random() * 0.42;
      finePositions[i * 3 + 2] = Math.sin(angle) * radius * 0.48 - Math.random() * 34;
    }

    const brightCount = 2600;
    const brightPositions = new Float32Array(brightCount * 3);
    for (let i = 0; i < brightCount; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 0.42) * 190;
      brightPositions[i * 3] = Math.cos(angle) * radius;
      brightPositions[i * 3 + 1] = -11.95 + Math.random() * 0.6;
      brightPositions[i * 3 + 2] = Math.sin(angle) * radius * 0.5 - Math.random() * 26;
    }

    const fineGeometry = new THREE.BufferGeometry();
    fineGeometry.setAttribute('position', new THREE.BufferAttribute(finePositions, 3));
    const brightGeometry = new THREE.BufferGeometry();
    brightGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
    return { fine: fineGeometry, bright: brightGeometry };
  }, []);

  return (
    <>
      <points geometry={fine}>
        <pointsMaterial
          size={0.16}
          color={WHITE}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <points geometry={bright}>
        <pointsMaterial
          size={0.34}
          color={WHITE}
          transparent
          opacity={0.78}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </>
  );
}

function SpiralRings() {
  const groupRef = useRef<THREE.Group>(null);
  const rings = useMemo(() => {
    return [12, 23, 36].map((radius, ringIndex) => {
      const group = new THREE.Group();
      const segmentCount = 34;
      const visibleFraction = 0.46;

      for (let segment = 0; segment < segmentCount; segment += 1) {
        const start = (segment / segmentCount) * Math.PI * 2;
        const end = start + (Math.PI * 2 / segmentCount) * visibleFraction;
        const points: THREE.Vector3[] = [];

        for (let i = 0; i <= 10; i += 1) {
          const angle = start + (end - start) * (i / 10);
          points.push(new THREE.Vector3(Math.cos(angle) * radius, -11.55, Math.sin(angle) * radius * 0.42));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const core = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 12, 0.035 + ringIndex * 0.012, 8, false),
          new THREE.MeshBasicMaterial({
            color: WHITE,
            transparent: true,
            opacity: 0.22 - ringIndex * 0.04,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          })
        );
        const glow = new THREE.Mesh(
          new THREE.TubeGeometry(curve, 12, 0.24 + ringIndex * 0.08, 10, false),
          new THREE.MeshBasicMaterial({
            color: WHITE,
            transparent: true,
            opacity: 0.045,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          })
        );

        group.add(glow);
        group.add(core);
      }

      group.rotation.y = ringIndex * 0.1;
      return group;
    });
  }, []);

  const halo = useMemo(() => {
    const count = 2200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 34 + Math.random() * 180;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -12.05 + Math.random() * 0.32;
      positions[i * 3 + 2] = Math.sin(angle) * radius * 0.42;
    }
    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return bufferGeometry;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={groupRef}>
      <points geometry={halo}>
        <pointsMaterial
          size={0.06}
          color={WHITE}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      {rings.map((ring, i) => (
        <primitive key={i} object={ring} />
      ))}
    </group>
  );
}

export function CosmosScene() {
  return (
    <div className="w-full h-full absolute inset-0 bg-black">
      <Canvas camera={{ position: [0, 7, 35], fov: 52 }}>
        {/* Scene Environment */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 28, 82]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[0, -4, 8]} intensity={34} color={WHITE} distance={44} />
        <pointLight position={[0, 14, -8]} intensity={18} color={WHITE} distance={60} />

        <GroundDust />
        <SpiralRings />
        <SparkleField />

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
