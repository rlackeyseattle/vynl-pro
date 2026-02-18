"use client";

import React, { useEffect, useRef } from 'react';

interface VUMeterProps {
    level: number; // 0 to 1
    label?: string;
}

export default function VUMeter({ level, label = "VU" }: VUMeterProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const needleValRed = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrame: number;

        const draw = () => {
            // Ballistics simulation (smooth movement)
            const target = Math.max(0, Math.min(1, level));
            // Simple low-pass filter for needle inertia
            needleValRed.current += (target - needleValRed.current) * 0.1;

            const w = canvas.width;
            const h = canvas.height;
            const cx = w / 2;
            const cy = h * 0.85;
            const radius = h * 0.7;

            ctx.clearRect(0, 0, w, h);

            // Background / housing
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#fef9c3'); // Light yellow/cream
            grad.addColorStop(1, '#fde047'); // Darker yellow
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Glass reflection (subtle)
            const glassGrad = ctx.createLinearGradient(0, 0, w, h);
            glassGrad.addColorStop(0, 'rgba(255,255,255,0.4)');
            glassGrad.addColorStop(0.5, 'rgba(255,255,255,0)');
            ctx.fillStyle = glassGrad;
            ctx.fillRect(0, 0, w, h);

            // Scale Arc
            ctx.beginPath();
            ctx.arc(cx, cy, radius, Math.PI + 0.5, 0 - 0.5);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333';
            ctx.stroke();

            // Ticks (Simplified)
            // -20 to +3 dB range mapped to angle
            // This is purely visual
            for (let i = -5; i <= 5; i++) {
                const angle = Math.PI + Math.PI / 2 + (i * 0.15); // distribute

                const startR = radius - 5;
                const endR = radius - 15;

                const x1 = cx + Math.cos(angle) * startR;
                const y1 = cy + Math.sin(angle) * startR;
                const x2 = cx + Math.cos(angle) * endR;
                const y2 = cy + Math.sin(angle) * endR;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = i > 3 ? '#ef4444' : '#000'; // Red scale
                ctx.lineWidth = i === 0 ? 3 : 1;
                ctx.stroke();
            }

            // Needle
            // Map 0-1 to angle range (approx -45deg to +45deg)
            const minAngle = Math.PI + 0.6;
            const maxAngle = Math.PI * 2 - 0.6;
            const currentAngle = minAngle + (needleValRed.current * (maxAngle - minAngle));

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(currentAngle) * (radius - 5), cy + Math.sin(currentAngle) * (radius - 5));
            ctx.strokeStyle = '#dc2626'; // Red needle
            ctx.lineWidth = 2;
            ctx.stroke();

            // Pivot
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#111';
            ctx.fill();

            // Label
            ctx.font = 'bold 10px monospace';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(label, cx, cy - 20);
        };

        const renderLoop = () => {
            draw();
            animationFrame = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        return () => cancelAnimationFrame(animationFrame);
    }, [level, label]);

    return (
        <div className="w-[120px] h-[80px] rounded border-2 border-gray-700 bg-[#1a1a1a] shadow-inner overflow-hidden relative">
            <canvas ref={canvasRef} width={120} height={80} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none rounded inner-shadow" />
        </div>
    );
}
