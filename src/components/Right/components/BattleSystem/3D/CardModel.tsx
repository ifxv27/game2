import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { BattleCard } from '../types';

interface CardModelProps {
  card: BattleCard;
  position: [number, number, number];
  rotation: [number, number, number];
  isPlayer: boolean;
  isAttacking: boolean;
  isDefending: boolean;
  onAnimationComplete?: () => void;
}

export function CardModel({
  card,
  position,
  rotation,
  isPlayer,
  isAttacking,
  isDefending,
  onAnimationComplete
}: CardModelProps) {
  const group = useRef<THREE.Group>();
  const meshRef = useRef<THREE.Mesh>();

  // Create character model
  useEffect(() => {
    if (group.current) {
      // Create basic character shape
      const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8);
      const material = new THREE.MeshStandardMaterial({
        color: isPlayer ? 0x00ff88 : 0xff0088,
        metalness: 0.5,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      meshRef.current = mesh;
      group.current.add(mesh);

      // Add glow effect
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: isPlayer ? 0x00ff88 : 0xff0088,
        transparent: true,
        opacity: 0.5,
      });
      const glowMesh = new THREE.Mesh(geometry, glowMaterial);
      glowMesh.scale.multiplyScalar(1.05);
      group.current.add(glowMesh);
    }
  }, [isPlayer]);

  // Handle attack animation
  useEffect(() => {
    if (isAttacking && group.current && meshRef.current) {
      // Attack animation
      gsap.to(group.current.position, {
        x: isPlayer ? position[0] + 2 : position[0] - 2,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
        onComplete: () => {
          createAttackEffect();
          onAnimationComplete?.();
        }
      });

      // Change color during attack
      gsap.to(meshRef.current.material, {
        emissiveIntensity: 2,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
    }
  }, [isAttacking, position, isPlayer, onAnimationComplete]);

  // Handle defense animation
  useEffect(() => {
    if (isDefending && group.current && meshRef.current) {
      // Shield effect
      const shieldGeometry = new THREE.SphereGeometry(1, 32, 32);
      const shieldMaterial = new THREE.MeshBasicMaterial({
        color: isPlayer ? 0x00ffff : 0xff00ff,
        transparent: true,
        opacity: 0.3,
      });
      const shield = new THREE.Mesh(shieldGeometry, shieldMaterial);
      group.current.add(shield);

      // Animate shield
      gsap.to(shield.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          group.current?.remove(shield);
          onAnimationComplete?.();
        }
      });
    }
  }, [isDefending, isPlayer, onAnimationComplete]);

  // Create attack effect
  const createAttackEffect = () => {
    if (!group.current) return;

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = Math.random() * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: isPlayer ? 0x00ff88 : 0xff0088,
      size: 0.1,
      transparent: true,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    group.current.add(particles);

    // Animate particles
    gsap.to(positions, {
      duration: 1,
      repeat: 0,
      onUpdate: () => {
        particlesGeometry.attributes.position.needsUpdate = true;
      },
      onComplete: () => {
        group.current?.remove(particles);
      }
    });
  };

  // Idle animation
  useFrame((state) => {
    if (group.current) {
      // Floating effect
      group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Subtle rotation
      group.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return <group ref={group} position={position} rotation={rotation} />;
}
