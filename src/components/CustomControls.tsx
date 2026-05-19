import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function CustomControls() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  // Track currently pressed keys
  const keys = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    // Initial camera position for cosmic feel
    camera.position.set(0, 0, 30);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    };
    
    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };
    
    // Using capturing phase to avoid being blocked by canvas
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);
    
    const handleResetView = () => {
      camera.position.set(0, 0, 30);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    };
    window.addEventListener('reset-view', handleResetView);

    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
      window.removeEventListener('reset-view', handleResetView);
    };
  }, [camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;
    
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const right = new THREE.Vector3();

    camera.getWorldDirection(direction);
    
    right.crossVectors(direction, camera.up).normalize();

    // WASD Movement logic mapped to the camera's perspective
    if (keys.current.w) velocity.add(direction);
    if (keys.current.s) velocity.sub(direction);
    if (keys.current.d) velocity.add(right);
    if (keys.current.a) velocity.sub(right);

    if (velocity.lengthSq() > 0) {
      velocity.normalize().multiplyScalar(30 * delta); // Base speed
      
      camera.position.add(velocity);
      controlsRef.current.target.add(velocity);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      makeDefault
      enablePan={false} // Disable mouse panning, rely on keyboard WASD
    />
  );
}
