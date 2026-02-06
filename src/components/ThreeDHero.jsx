import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars, Float, Text, Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { useTranslation } from 'react-i18next';

// --- Configuration ---
const RING_1_COUNT = 30;
const RING_1_RADIUS = 6;
const RING_2_COUNT = 40;
const RING_2_RADIUS = 9;

const COLORS = ["#7f1d1d", "#1e3a8a", "#064e3b", "#78350f", "#4c1d95"]; // Red, Blue, Green, Brown, Violet

// --- Book Component (Instance) ---
function Book({ position, rotation, color }) {
    return (
        <group position={position} rotation={rotation}>
            <Instance color={color} />
        </group>
    );
}

// --- Orbital Ring ---
function BookRing({ count, radius, speed, axisTilt = [0, 0, 0], yOffset = 0 }) {
    const group = useRef();

    const books = useMemo(() => {
        const items = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            items.push({
                pos: [x, 0, z],
                rot: [0, -angle, 0], // Face inward/outward
                color: COLORS[Math.floor(Math.random() * COLORS.length)]
            });
        }
        return items;
    }, [count, radius]);

    useFrame((state, delta) => {
        if (!group.current) return;
        // Rotation
        group.current.rotation.y += delta * speed;
    });

    return (
        <group ref={group} rotation={axisTilt} position={[0, yOffset, 0]}>
            {books.map((b, i) => (
                <Book
                    key={i}
                    position={b.pos}
                    rotation={b.rot}
                    color={b.color}
                />
            ))}
        </group>
    );
}

// --- Background Particles ---
function KnowledgeDust() {
    const { clock } = useThree();
    const ref = useRef();

    // Simple floating particles logic if needed, or stick to Stars/Sparkles from drei
    return (
        <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    );
}

// --- Main Scene ---
function Scene() {
    const group = useRef();
    const { mouse } = useThree();

    useFrame((state) => {
        if (group.current) {
            // Parallax Tilt
            const x = -mouse.y * 0.1;
            const y = mouse.x * 0.1;
            group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, x, 0.05);
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, y, 0.05);
        }
    });

    return (
        <group ref={group}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#fff" />
            <pointLight position={[-10, -5, -10]} intensity={1} color="#fbbf24" />

            <Instances>
                <boxGeometry args={[0.4, 2.4, 1.8]} /> {/* Thick books */}
                <meshStandardMaterial roughness={0.3} metalness={0.1} />

                {/* Inner Ring (Tilted) */}
                <BookRing count={RING_1_COUNT} radius={RING_1_RADIUS} speed={0.05} axisTilt={[0.2, 0, 0.2]} yOffset={1} />

                {/* Outer Ring (Opposite Tilt) */}
                <BookRing count={RING_2_COUNT} radius={RING_2_RADIUS} speed={-0.03} axisTilt={[-0.2, 0, -0.1]} yOffset={-1} />
            </Instances>

            <KnowledgeDust />
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Floating Center Badge or Logo optionally */}
            </Float>
        </group>
    );
}

export default function ThreeDHero({ onScrollClick }) {
    const { t } = useTranslation();

    return (
        <div className="relative w-full h-screen bg-[#0f172a] overflow-hidden flex flex-col items-center justify-center">

            {/* 3D Layer */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-white">Loading Archive...</div>}>
                    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 14], fov: 45 }}>
                        <Scene />
                        <Environment preset="city" />
                    </Canvas>
                </Suspense>
            </div>

            {/* Content Layer (Glassmorphism) */}
            <div className="relative z-10 p-8 md:p-12 rounded-2xl bg-slate-900/30 backdrop-blur-md border border-white/10 text-center max-w-4xl mx-4 shadow-2xl">
                <div className="mb-6 flex justify-center">
                    <div className="px-4 py-1 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold tracking-widest uppercase">
                        Smart Library v2.0
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-blue-300">
                        {t("hero.welcome_part1", "Kashf")}
                    </span>
                    <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
                        {t("hero.welcome_part2", "Eting")}
                    </span>
                </h1>

                <p className="text-slate-200 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed shadow-black drop-shadow-md">
                    Minglab kitoblar, ilmiy manbalar va cheksiz bilim olami.
                    Sizning shaxsiy raqamli kutubxonangiz.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onScrollClick}
                        className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-lg hover:shadow-amber-500/50 transition-all transform hover:-translate-y-1"
                    >
                        Kutubxonaga Kirish
                    </button>
                    <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg border border-white/20 backdrop-blur-sm transition-all">
                        Batafsil Ma'lumot
                    </button>
                </div>
            </div>

            {/* Decorative Bottom Gradient */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none"></div>
        </div>
    );
}
