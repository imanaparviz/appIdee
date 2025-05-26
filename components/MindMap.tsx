"use client";

import React, { useState, useEffect } from "react";
import {
  Brain,
  GitBranch,
  Code,
  Database,
  Palette,
  Globe,
  Smartphone,
  Server,
  Shield,
  Rocket,
  Zap,
  Sparkles,
} from "lucide-react";

interface MindMapBranch {
  title: string;
  subtopics: string[];
}

interface MindMapData {
  center: string;
  branches: MindMapBranch[];
}

interface MindMapProps {
  data: MindMapData;
}

const getDarkColorForBranch = (index: number) => {
  const darkColors = [
    {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      border: "#667eea",
      text: "#ffffff",
      glow: "rgba(102, 126, 234, 0.4)",
    }, // Purple-Blue
    {
      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      border: "#f093fb",
      text: "#ffffff",
      glow: "rgba(240, 147, 251, 0.4)",
    }, // Pink-Red
    {
      bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      border: "#4facfe",
      text: "#ffffff",
      glow: "rgba(79, 172, 254, 0.4)",
    }, // Blue-Cyan
    {
      bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      border: "#43e97b",
      text: "#ffffff",
      glow: "rgba(67, 233, 123, 0.4)",
    }, // Green-Teal
    {
      bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      border: "#fa709a",
      text: "#ffffff",
      glow: "rgba(250, 112, 154, 0.4)",
    }, // Pink-Yellow
    {
      bg: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      border: "#a8edea",
      text: "#2d3748",
      glow: "rgba(168, 237, 234, 0.4)",
    }, // Light Teal-Pink
    {
      bg: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      border: "#ff9a9e",
      text: "#2d3748",
      glow: "rgba(255, 154, 158, 0.4)",
    }, // Coral-Pink
    {
      bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      border: "#fcb69f",
      text: "#2d3748",
      glow: "rgba(252, 182, 159, 0.4)",
    }, // Peach
  ];
  return darkColors[index % darkColors.length];
};

// Generate smooth curved path with better curves
const generateSmoothCurvePath = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  curvature: number = 0.4
) => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // Dynamic control points for more natural curves
  const cp1X = startX + deltaX * curvature + deltaY * 0.1;
  const cp1Y = startY + deltaY * curvature - deltaX * 0.1;
  const cp2X = endX - deltaX * curvature + deltaY * 0.1;
  const cp2Y = endY - deltaY * curvature - deltaX * 0.1;

  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
};

export function MindMap({ data }: MindMapProps) {
  const [hoveredBranch, setHoveredBranch] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Ensure data structure is valid
  const safeData = {
    center: data?.center || "Project",
    branches: Array.isArray(data?.branches) ? data.branches : [],
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 300);
    const timer2 = setTimeout(() => setAnimationPhase(1), 800);
    const timer3 = setTimeout(() => setAnimationPhase(2), 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="w-full h-[800px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 overflow-hidden relative border border-gray-700 shadow-2xl">
      {/* Reduced animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Sparkles className="w-1 h-1 text-blue-400" />
          </div>
        ))}
      </div>

      {/* SVG for all connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          {/* Gradient definitions */}
          {safeData.branches.map((_, index) => {
            const color = getDarkColorForBranch(index);
            return (
              <g key={index}>
                <linearGradient
                  id={`branchGradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop
                    offset="0%"
                    stopColor={color.border}
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="50%"
                    stopColor={color.border}
                    stopOpacity="0.6"
                  />
                  <stop
                    offset="100%"
                    stopColor={color.border}
                    stopOpacity="0.2"
                  />
                </linearGradient>

                {/* Glow filter */}
                <filter
                  id={`glow-${index}`}
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </g>
            );
          })}

          {/* Central glow filter */}
          <filter id="centralGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Animated connection lines */}
        {safeData.branches.map((branch, index) => {
          const angle = (360 / safeData.branches.length) * index - 90;
          const radius = 280;
          const x = Math.cos((angle * Math.PI) / 180) * radius + 400;
          const y = Math.sin((angle * Math.PI) / 180) * radius + 400;

          const path = generateSmoothCurvePath(400, 400, x, y, 0.5);
          const color = getDarkColorForBranch(index);
          const isHovered = hoveredBranch === index;

          return (
            <g key={index}>
              {/* Glow effect background */}
              <path
                d={path}
                stroke={color.border}
                strokeWidth={isHovered ? "8" : "6"}
                fill="none"
                opacity="0.3"
                filter={`url(#glow-${index})`}
                className="transition-all duration-500"
              />

              {/* Main connection line */}
              <path
                d={path}
                stroke={`url(#branchGradient-${index})`}
                strokeWidth={isHovered ? "4" : "3"}
                fill="none"
                className="transition-all duration-500"
                style={{
                  strokeDasharray: animationPhase >= 1 ? "none" : "20,10",
                  strokeDashoffset: animationPhase >= 1 ? "0" : "30",
                  animation:
                    animationPhase >= 1
                      ? "none"
                      : "dash 2s ease-in-out forwards",
                }}
              />

              {/* Sub-branches */}
              {animationPhase >= 2 &&
                (branch.subtopics || []).slice(0, 3).map((_, subIndex) => {
                  const subAngle = angle + (subIndex - 1) * 15;
                  const subRadius = radius + 120;
                  const subX =
                    Math.cos((subAngle * Math.PI) / 180) * subRadius + 400;
                  const subY =
                    Math.sin((subAngle * Math.PI) / 180) * subRadius + 400;

                  const subPath = generateSmoothCurvePath(
                    x,
                    y,
                    subX,
                    subY,
                    0.3
                  );

                  return (
                    <path
                      key={subIndex}
                      d={subPath}
                      stroke={color.border}
                      strokeWidth="2"
                      fill="none"
                      opacity={isHovered ? "0.8" : "0.5"}
                      strokeDasharray="6,4"
                      className="transition-all duration-300"
                      filter={isHovered ? `url(#glow-${index})` : "none"}
                    />
                  );
                })}
            </g>
          );
        })}
      </svg>

      {/* Central Node - Enhanced Design */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1500 ${
          isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="relative group">
          {/* Outer glow ring */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-sm scale-110"></div>

          {/* Main central node */}
          <div
            className="relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 text-white font-bold text-lg shadow-2xl flex items-center justify-center border-2 border-gray-600 backdrop-blur-sm"
            style={{
              width: "200px",
              height: "90px",
              borderRadius: "45px",
              background:
                "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
              filter: "url(#centralGlow)",
            }}
          >
            <Brain className="w-6 h-6 mr-2 text-blue-400 animate-pulse" />
            <span className="text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-sm">
              {safeData.center}
            </span>
          </div>

          {/* Floating particles around center - reduced */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-30"
              style={{
                left: `${50 + 35 * Math.cos((i * 90 * Math.PI) / 180)}%`,
                top: `${50 + 35 * Math.sin((i * 90 * Math.PI) / 180)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Enhanced Branch Nodes */}
      {safeData.branches.map((branch, index) => {
        const angle = (360 / safeData.branches.length) * index - 90;
        const radius = 280;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        const color = getDarkColorForBranch(index);
        const isHovered = hoveredBranch === index;

        return (
          <div key={index} style={{ zIndex: 5 }}>
            {/* Main Branch Topic */}
            <div
              className={`absolute transition-all duration-700 cursor-pointer group ${
                isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } ${isHovered ? "scale-110 z-20" : "z-10"}`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${index * 0.15}s`,
              }}
              onMouseEnter={() => setHoveredBranch(index)}
              onMouseLeave={() => setHoveredBranch(null)}
            >
              {/* Glow effect for hover */}
              {isHovered && (
                <div
                  className="absolute inset-0 rounded-2xl blur-md -z-10"
                  style={{
                    background: color.bg,
                    transform: "scale(1.1)",
                    opacity: 0.6,
                  }}
                />
              )}

              <div
                className="px-4 py-3 font-semibold text-base shadow-2xl border-2 transition-all duration-300 backdrop-blur-sm"
                style={{
                  background: color.bg,
                  borderColor: color.border,
                  color: color.text,
                  borderRadius: "16px",
                  minWidth: "120px",
                  textAlign: "center",
                  boxShadow: isHovered
                    ? `0 15px 30px ${color.glow}, 0 5px 15px rgba(0,0,0,0.3)`
                    : "0 8px 20px rgba(0,0,0,0.4)",
                  transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 1}deg)`,
                }}
              >
                {branch.title}
              </div>
            </div>

            {/* Enhanced Subtopic Nodes */}
            {animationPhase >= 2 &&
              (branch.subtopics || []).slice(0, 3).map((subtopic, subIndex) => {
                const subAngle = angle + (subIndex - 1) * 15;
                const subRadius = radius + 120;
                const subX = Math.cos((subAngle * Math.PI) / 180) * subRadius;
                const subY = Math.sin((subAngle * Math.PI) / 180) * subRadius;

                return (
                  <div
                    key={subIndex}
                    className={`absolute transition-all duration-1000 cursor-pointer hover:scale-110 ${
                      isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    } ${
                      isHovered
                        ? "scale-105 opacity-100"
                        : "scale-100 opacity-80"
                    }`}
                    style={{
                      left: `calc(50% + ${subX}px)`,
                      top: `calc(50% + ${subY}px)`,
                      transform: "translate(-50%, -50%)",
                      animationDelay: `${index * 0.15 + subIndex * 0.1 + 0.8}s`,
                      zIndex: 3,
                    }}
                  >
                    <div
                      className="px-3 py-2 text-xs font-medium shadow-lg border transition-all duration-300 backdrop-blur-sm"
                      style={{
                        background: isHovered
                          ? `linear-gradient(135deg, ${color.border}22, ${color.border}44)`
                          : "linear-gradient(135deg, #374151, #1f2937)",
                        borderColor: color.border,
                        color: "#e5e7eb",
                        borderRadius: "10px",
                        maxWidth: "100px",
                        textAlign: "center",
                        boxShadow: isHovered
                          ? `0 8px 20px ${color.glow}`
                          : "0 4px 12px rgba(0,0,0,0.3)",
                      }}
                    >
                      {subtopic}
                    </div>
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

// Add CSS animation for dash effect (only on client side)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes dash {
      from { stroke-dashoffset: 30; }
      to { stroke-dashoffset: 0; }
    }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }
  `;
  document.head.appendChild(style);
}
