"use client";

import React from 'react';

interface ArcMeterProps {
    level: number; // 0 to 1
    label?: string;
    color?: string;
    size?: number;
}

export default function ArcMeter({ level, label = "L", color = "#10b981", size = 100 }: ArcMeterProps) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    // We want a 240 degree arc (leaving bottom open)
    const arcLength = circumference * (240 / 360);
    const strokeDashoffset = arcLength - (Math.min(1, Math.max(0, level)) * arcLength);

    return (
        <div className="relative flex flex-col items-center justify-center font-sans" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="rotate-[150deg]"> {/* Rotate to start at bottom left */}
                {/* Background Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#1a1a1a" // Very dark gray track
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeLinecap="round"
                />

                {/* Foreground Meter */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${arcLength} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-[stroke-dashoffset] duration-75 ease-out"
                />
            </svg>

            {/* Label inside */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
}
