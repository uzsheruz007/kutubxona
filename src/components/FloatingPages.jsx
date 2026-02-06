import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

const PAGE_COUNT = 50;

// Placeholder Texture for Manuscript Page (Base64 or URL)
// Using a procedural canvas texture approach would be safest, but let's try a direct material setup 
// or simpler: just lines on the box to simulate text.

function InteractivePages() {
    const meshRef = useRef();
    const { mouse, viewport } = useThree();

    // Generate Particles with Random Attributes
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < PAGE_COUNT; i++) {
            // Spread wider than viewport
            const x = (Math.random() - 0.5) * 25;
            const y = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 10 - 5;

            temp.push({
                x, y, z,
                // unique offsets
                speed: 0.01 + Math.random() * 0.02,
                rotSpeedX: (Math.random() - 0.5) * 0.02,
                rotSpeedY: (Math.random() - 0.5) * 0.02,
                // Current rotation
                rotX: Math.random() * Math.PI,
                rotY: Math.random() * Math.PI,
                scale: 0.8 + Math.random() * 0.5 // Varied sizes
            });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Mouse Interaction Factor (lerped for smoothness)
        // mouse.x is -1 to 1.
        const targetX = mouse.x * 2;
        const targetY = mouse.y * 2;

        particles.forEach((p, i) => {
            // 1. Natural Drift (Upwards)
            p.y += p.speed;

            // 2. Mouse Influence (Wind)
            // Pages drift AWAY from mouse or Towards? 
            // Let's make them flow WITH the mouse like a stream.
            // Or Parallax: Mouse Left -> Pages Right (depth feel).
            // Let's go with "Attraction/Swirl" - slight movement towards mouse.

            const dx = targetX - p.x;
            const dy = targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Gentle push away if too close (Turbulence)
            if (dist < 4) {
                p.x -= dx * 0.01;
                p.y -= dy * 0.01;
            } else {
                // General swaying background wind based on mouse x
                p.x += mouse.x * 0.05;
                p.y += mouse.y * 0.05;
            }

            // 3. Rotation (Tumbling)
            p.rotX += p.rotSpeedX;
            p.rotY += p.rotSpeedY;

            // 4. Reset Loops
            if (p.y > 12) p.y = -12;
            if (p.y < -12) p.y = 12;
            if (p.x > 15) p.x = -15;
            if (p.x < -15) p.x = 15;

            // Apply
            dummy.position.set(p.x, p.y, p.z);
            dummy.rotation.set(p.rotX, p.rotY, 0);
            dummy.scale.set(p.scale, p.scale * 1.4, 1); // 1:1.4 aspect ratio for paper

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#fff" />
            <ambientLight intensity={0.5} />

            <instancedMesh ref={meshRef} args={[null, null, PAGE_COUNT]}>
                {/* Paper Geometry */}
                <planeGeometry args={[1, 1]} />
                {/* Gold/Parchment Material */}
                {/* Using a simple noise texture or color mix to look like paper */}
                <meshStandardMaterial
                    color="#fef3c7" // Warm Paper
                    side={THREE.DoubleSide}
                    roughness={0.6}
                    transparent opacity={0.9}
                >
                </meshStandardMaterial>
            </instancedMesh>
        </>
    );
}

export default function FloatingPages() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }} dpr={[1, 1.5]}>
                <InteractivePages />
            </Canvas>
        </div>
    );
}
