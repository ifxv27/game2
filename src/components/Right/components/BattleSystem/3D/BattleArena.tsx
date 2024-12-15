import React, { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

interface BattleArenaProps {
  onReady: () => void;
}

export function BattleArena({ onReady }: BattleArenaProps) {
  const { scene, camera } = useThree();
  const arenaRef = useRef<THREE.Group>(new THREE.Group());
  const lightRef = useRef<THREE.SpotLight>();

  useEffect(() => {
    if (arenaRef.current) {
      // Create a simple platform
      const geometry = new THREE.CylinderGeometry(5, 5, 0.2, 32);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        metalness: 0.8,
        roughness: 0.2
      });
      const platform = new THREE.Mesh(geometry, material);
      arenaRef.current.add(platform);

      // Add some decorative elements
      const ringGeometry = new THREE.TorusGeometry(5.2, 0.1, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = 0.1;
      arenaRef.current.add(ring);

      // Initial camera animation
      gsap.from(camera.position, {
        duration: 2,
        z: 20,
        y: 10,
        ease: "power2.inOut",
        onComplete: onReady
      });

      // Add dynamic lighting
      const spotLight = new THREE.SpotLight(0x7c00ff, 2);
      spotLight.position.set(0, 10, 0);
      spotLight.angle = Math.PI / 4;
      spotLight.penumbra = 0.1;
      spotLight.decay = 2;
      spotLight.distance = 200;
      
      lightRef.current = spotLight;
      scene.add(spotLight);

      // Animate ring
      gsap.to(ring.rotation, {
        y: Math.PI * 2,
        duration: 8,
        repeat: -1,
        ease: "none"
      });

      // Add to scene
      scene.add(arenaRef.current);
    }

    return () => {
      if (arenaRef.current) {
        scene.remove(arenaRef.current);
      }
    };
  }, [camera, scene, onReady]);

  return (
    <>
      <group ref={arenaRef} />

      {/* Environment and Effects */}
      <Environment preset="night" />
      <ContactShadows
        opacity={0.4}
        scale={10}
        blur={2}
        far={10}
        resolution={256}
        color="#000000"
      />
      
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      {/* Basic Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#ff00ff" />
    </>
  );
}
