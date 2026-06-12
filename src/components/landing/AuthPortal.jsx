"use client";

import { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, EnvelopeSimple, LockKey, Check, GitBranch, Cloud } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function AuthPortal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const { setAccessToken } = useAuth();
  const router = useRouter();

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setAccessToken(credential.accessToken);
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  // Track mouse coordinates globally for the repel effect
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isOpen) {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    let pWidth, pHeight, animId, resizeTimeout;
    const nodes = [];
    const dust = [];
    let pulses = [];
    let dpr = 1;

    const cols = 18;
    const rows = 24;
    const fov = 350; // Camera perspective distance

    const colorLeft1 = [6, 182, 212]; // cyan
    const colorLeft2 = [16, 185, 129]; // emerald
    const colorRight1 = [112, 0, 255]; // purple
    const colorRight2 = [168, 85, 247]; // magenta

    const rowThicknesses = [[], []]; // [left, right]
    const rowPulseSpeeds = [[], []]; // [left, right]

    function getRawColor(c1, c2, t) {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return `${r}, ${g}, ${b}`;
    }

    function getNode(isLeft, c, r) {
      const sideOffset = isLeft ? 0 : cols * rows;
      const idx = sideOffset + r * cols + c;
      return nodes[idx];
    }

    function spawnPulse() {
      const isLeft = Math.random() > 0.5;
      const row = Math.floor(Math.random() * rows);
      const isEntering = Math.random() > 0.3; // 70% entering edge -> card

      const startNode = getNode(isLeft, isEntering ? 0 : cols - 1, row);
      if (!startNode) return;

      pulses.push({
        isLeft,
        row,
        progress: isEntering ? 0 : cols - 1,
        speed: (0.04 + Math.random() * 0.04) * (isEntering ? 1 : -1),
        size: 1.0 + Math.random() * 1.0,
        color: startNode.color,
        isEntering
      });
    }

    function initNetwork() {
      nodes.length = 0;
      pulses.length = 0;
      dust.length = 0;

      const cx = pWidth / 2;
      const cy = pHeight / 2;

      let cardW = 440;
      let cardH = 500;
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        if (rect.width > 0) cardW = rect.width;
        if (rect.height > 0) cardH = rect.height;
      }

      const offset = (cardW / 2) - 15; // overlap 15px inside card boundary

      // Initialize row thicknesses and pulse speeds
      rowThicknesses[0] = [];
      rowThicknesses[1] = [];
      rowPulseSpeeds[0] = [];
      rowPulseSpeeds[1] = [];

      for (let r = 0; r < rows; r++) {
        // Vary thicknesses: some thick fibers, some thin
        rowThicknesses[0].push(Math.random() > 0.7 ? 1.6 + Math.random() * 0.8 : 0.6 + Math.random() * 0.4);
        rowThicknesses[1].push(Math.random() > 0.7 ? 1.6 + Math.random() * 0.8 : 0.6 + Math.random() * 0.4);
        
        rowPulseSpeeds[0].push(0.75 + Math.random() * 0.5);
        rowPulseSpeeds[1].push(0.75 + Math.random() * 0.5);
      }

      // Left mesh nodes
      let id = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cNorm = c / (cols - 1);
          const rNorm = r / (rows - 1);

          const baseX = -40 + cNorm * (cx - offset + 40);
          const baseY = pHeight * 0.05 + rNorm * pHeight * 0.9;
          const color = getRawColor(colorLeft1, colorLeft2, rNorm);

          nodes.push({
            id: id++,
            col: c,
            row: r,
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            z: 0,
            zBase: 0,
            vx: 0,
            vy: 0,
            vz: 0,
            intensity: 0,
            color,
            isLeft: true
          });
        }
      }

      // Right mesh nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cNorm = c / (cols - 1);
          const rNorm = r / (rows - 1);

          const baseX = pWidth + 40 - cNorm * (pWidth + 40 - (cx + offset));
          const baseY = pHeight * 0.05 + rNorm * pHeight * 0.9;
          const color = getRawColor(colorRight1, colorRight2, rNorm);

          nodes.push({
            id: id++,
            col: c,
            row: r,
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            z: 0,
            zBase: 0,
            vx: 0,
            vy: 0,
            vz: 0,
            intensity: 0,
            color,
            isLeft: false
          });
        }
      }

      // Atmospheric stardust in 3D
      for (let i = 0; i < 40; i++) {
        dust.push({
          x: Math.random() * pWidth,
          y: Math.random() * pHeight,
          z: (Math.random() - 0.3) * 300, // Z depth range
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          vz: (Math.random() - 0.5) * 0.05,
          size: 0.4 + Math.random() * 0.6,
          alpha: 0.08 + Math.random() * 0.22,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.006
        });
      }

      // Pre-fill pulses
      for (let i = 0; i < 24; i++) {
        spawnPulse();
      }
    }

    let isInitial = true;
    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      pWidth = window.innerWidth;
      pHeight = window.innerHeight;
      canvas.width = pWidth * dpr;
      canvas.height = pHeight * dpr;
      ctx.scale(dpr, dpr);

      if (isInitial) {
        initNetwork();
        isInitial = false;
      } else {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initNetwork, 50);
      }
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    mouseRef.current = { x: -1000, y: -1000 };
    const spring = 0.035; // spring-back force
    const friction = 0.88; // damping
    const hoverRadius = 150;
    const maxRepelDist = hoverRadius * hoverRadius;

    function draw() {
      ctx.clearRect(0, 0, pWidth, pHeight);
      ctx.globalCompositeOperation = "source-over";

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const time = Date.now() * 0.001;
      const cx = pWidth / 2;
      const cy = pHeight / 2;

      // 1. Draw stardust in 3D space
      dust.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0) p.x = pWidth;
        if (p.x > pWidth) p.x = 0;
        if (p.y < 0) p.y = pHeight;
        if (p.y > pHeight) p.y = 0;
        if (p.z < -100) p.z = 200;
        if (p.z > 200) p.z = -100;

        const scale = fov / Math.max(50, fov + p.z);
        const px = cx + (p.x - cx) * scale;
        const py = cy + (p.y - cy) * scale;

        const dx = px - mx;
        const dy = py - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 130 * 130) {
          const dist = Math.sqrt(distSq);
          if (dist > 1) {
            const force = ((130 - dist) / 130) * 0.05;
            p.x += (dx / dist) * force * 4;
            p.y += (dy / dist) * force * 4;
          }
        }

        p.phase += p.speed;
        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase)) * scale;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.globalAlpha = Math.max(0, Math.min(0.8, currentAlpha));
        ctx.fill();
      });

      // 2. Update node 3D physics and waves
      nodes.forEach(node => {
        // Coherent wave pattern on mesh (only depends on col and time, NOT row)
        // This ensures the grid waves in parallel and never entangles
        const waveZ = Math.sin(node.col * 0.45 - time * 1.6) * 50;
        node.zBase = waveZ;

        node.vx += (node.baseX - node.x) * spring;
        node.vy += (node.baseY - node.y) * spring;
        node.vz += (node.zBase - node.z) * spring;

        const dx = node.x - mx;
        const dy = node.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < maxRepelDist && distSq > 0.1) {
          const dist = Math.sqrt(distSq);
          const force = (hoverRadius - dist) / hoverRadius;
          node.vx += (dx / dist) * force * 5.0;
          node.vy += (dy / dist) * force * 5.0;
          node.vz += force * 90;
          node.intensity = Math.min(2.0, node.intensity + force * 0.3);
        }

        node.vx *= friction;
        node.vy *= friction;
        node.vz *= friction;
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        node.intensity *= 0.94;
        if (node.intensity < 0.01) node.intensity = 0;
      });

      // Helper function to evaluate high-resolution fiber point in 3D space
      function getFiberPoint(isLeft, r, p) {
        const clampedP = Math.max(0, Math.min(cols - 1, p));
        const idx = Math.floor(clampedP);
        const nextIdx = Math.min(cols - 1, idx + 1);
        const t = clampedP - idx;

        const nodeA = getNode(isLeft, idx, r);
        const nodeB = getNode(isLeft, nextIdx, r);
        if (!nodeA || !nodeB) return { projX: 0, projY: 0, scale: 1, intensity: 0 };

        // 1. Linearly interpolate base coordinates
        const xBase = nodeA.baseX + (nodeB.baseX - nodeA.baseX) * t;
        const yBase = nodeA.baseY + (nodeB.baseY - nodeA.baseY) * t;

        // 2. Linearly interpolate physical mouse offsets
        const offsetA_x = nodeA.x - nodeA.baseX;
        const offsetA_y = nodeA.y - nodeA.baseY;
        const offsetA_z = nodeA.z - nodeA.zBase;

        const offsetB_x = nodeB.x - nodeB.baseX;
        const offsetB_y = nodeB.y - nodeB.baseY;
        const offsetB_z = nodeB.z - nodeB.zBase;

        const offsetX = offsetA_x + (offsetB_x - offsetA_x) * t;
        const offsetY = offsetA_y + (offsetB_y - offsetA_y) * t;
        const offsetZ = offsetA_z + (offsetB_z - offsetA_z) * t;

        // 3. Continuous coherent wave at column p
        const zWave = Math.sin(clampedP * 0.45 - time * 1.6) * 50;
        const yWave = Math.sin(clampedP * 0.35 - time * 1.3) * 16;

        // 4. Combine base + offset + wave
        const x = xBase + offsetX;
        const y = yBase + yWave + offsetY;
        const z = zWave + offsetZ;

        // 5. Full 3D perspective projection
        const scale = fov / Math.max(50, fov + z);
        const projX = cx + (x - cx) * scale;
        const projY = cy + (y - cy) * scale;

        return {
          projX,
          projY,
          scale,
          intensity: nodeA.intensity + (nodeB.intensity - nodeA.intensity) * t
        };
      }

      // 3. Draw horizontal fiber optic wires as smooth curves
      for (let side = 0; side < 2; side++) {
        const isLeft = side === 0;
        for (let r = 0; r < rows; r++) {
          const pathPoints = [];
          const steps = 40;
          for (let i = 0; i <= steps; i++) {
            const p = (i / steps) * (cols - 1);
            pathPoints.push(getFiberPoint(isLeft, r, p));
          }

          const firstPt = pathPoints[0];
          const lastPt = pathPoints[pathPoints.length - 1];

          // Create gradient for color fade-out at borders/card
          const grad = ctx.createLinearGradient(firstPt.projX, firstPt.projY, lastPt.projX, lastPt.projY);
          
          const baseAlpha = isLeft ? 0.28 + (r / rows) * 0.22 : 0.5 - (r / rows) * 0.22;
          const hueShift = Math.sin(time * 0.6 + r * 0.25) * 0.15;
          const cNorm = Math.max(0, Math.min(1, (r / (rows - 1)) + hueShift));
          
          const c1 = isLeft ? colorLeft1 : colorRight1;
          const c2 = isLeft ? colorLeft2 : colorRight2;
          const rawColor = getRawColor(c1, c2, cNorm);

          grad.addColorStop(0, `rgba(${rawColor}, 0)`);
          grad.addColorStop(0.18, `rgba(${rawColor}, ${baseAlpha * 0.65})`);
          grad.addColorStop(0.82, `rgba(${rawColor}, ${baseAlpha})`);
          grad.addColorStop(1, `rgba(${rawColor}, 0)`);

          // Calculate average properties along path
          let sumScale = 0;
          let sumIntensity = 0;
          pathPoints.forEach(pt => {
            sumScale += pt.scale;
            sumIntensity += pt.intensity;
          });
          const avgScale = sumScale / pathPoints.length;
          const avgIntensity = sumIntensity / pathPoints.length;
          
          const rowThickness = rowThicknesses[isLeft ? 0 : 1][r];

          // Pass 1: Wide Outer Glow
          ctx.beginPath();
          ctx.moveTo(firstPt.projX, firstPt.projY);
          for (let i = 1; i < pathPoints.length; i++) {
            ctx.lineTo(pathPoints[i].projX, pathPoints[i].projY);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = rowThickness * 3.8 * avgScale;
          ctx.globalAlpha = 0.12 * (1 + avgIntensity * 0.5);
          ctx.stroke();

          // Pass 2: Sharp Inner Core
          ctx.lineWidth = rowThickness * avgScale;
          ctx.globalAlpha = 0.72 * (1 + avgIntensity * 0.4);
          ctx.stroke();

          // Pass 3: Core Highlight on Hover Repulsion
          if (avgIntensity > 0.15) {
            ctx.lineWidth = rowThickness * 0.5 * avgScale;
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(0.9, avgIntensity * 0.6)})`;
            ctx.globalAlpha = 1.0;
            ctx.stroke();
          }
        }
      }

      // 4. Draw vertical structural mesh connections (thin and faint)
      for (let side = 0; side < 2; side++) {
        const isLeft = side === 0;
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          
          // Compute first point
          const firstNode = getNode(isLeft, c, 0);
          const firstWaveY = Math.sin(c * 0.35 - time * 1.3) * 16;
          const firstScale = fov / Math.max(50, fov + firstNode.z);
          ctx.moveTo(cx + (firstNode.x - cx) * firstScale, cy + (firstNode.y + firstWaveY - cy) * firstScale);

          for (let r = 1; r < rows; r++) {
            const node = getNode(isLeft, c, r);
            const waveY = Math.sin(c * 0.35 - time * 1.3) * 16;
            const scale = fov / Math.max(50, fov + node.z);
            ctx.lineTo(cx + (node.x - cx) * scale, cy + (node.y + waveY - cy) * scale);
          }

          const midNorm = 0.5;
          const c1 = isLeft ? colorLeft1 : colorRight1;
          const c2 = isLeft ? colorLeft2 : colorRight2;
          const rawColor = getRawColor(c1, c2, midNorm);

          ctx.strokeStyle = `rgba(${rawColor}, 0.05)`;
          ctx.lineWidth = 0.45;
          ctx.globalAlpha = 1.0;
          ctx.stroke();
        }
      }

      // 5. Update and render active pulses
      const activePulses = [];
      pulses.forEach(pulse => {
        pulse.progress += pulse.speed * rowPulseSpeeds[pulse.isLeft ? 0 : 1][pulse.row];

        const isDead = pulse.isEntering ? (pulse.progress >= cols - 1) : (pulse.progress <= 0);

        if (!isDead) {
          const index = Math.floor(pulse.progress);
          const tNorm = pulse.progress - index;
          const nodeA = getNode(pulse.isLeft, index, pulse.row);
          const nodeB = getNode(pulse.isLeft, index + 1, pulse.row);
          if (nodeA) nodeA.intensity = Math.min(2.0, nodeA.intensity + (1 - tNorm) * 0.06);
          if (nodeB) nodeB.intensity = Math.min(2.0, nodeB.intensity + tNorm * 0.06);

          activePulses.push(pulse);
        } else {
          const finalCol = pulse.isEntering ? cols - 1 : 0;
          const finalNode = getNode(pulse.isLeft, finalCol, pulse.row);
          if (finalNode) finalNode.intensity = Math.min(2.0, finalNode.intensity + 0.5);
        }
      });
      pulses = activePulses;

      while (pulses.length < 24) {
        spawnPulse();
      }

      // Render pulses with comet white-to-color trailing effects
      pulses.forEach(pulse => {
        const p = pulse.progress;
        const isLeft = pulse.isLeft;
        const row = pulse.row;
        const dir = Math.sign(pulse.speed);

        const tailSegments = 6;
        for (let s = tailSegments - 1; s >= 0; s--) {
          const tailP = p - dir * s * 0.24;
          const pt = getFiberPoint(isLeft, row, tailP);

          const tColor = s === 0 ? "255, 255, 255" : pulse.color;
          const alphaNorm = 1 - s / tailSegments;
          const alpha = 0.95 * pt.scale * Math.pow(0.55, s);

          ctx.beginPath();
          const r = pulse.size * pt.scale * (1.2 - s * 0.16);
          ctx.arc(pt.projX, pt.projY, Math.max(0.1, r), 0, Math.PI * 2);

          if (s === 0) {
            // Glowing comet head
            ctx.shadowBlur = 9 * pt.scale;
            ctx.shadowColor = `rgb(${pulse.color})`;
            ctx.fillStyle = "#FFFFFF";
            ctx.globalAlpha = 0.95 * pt.scale;
          } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(${tColor}, ${alphaNorm})`;
            ctx.globalAlpha = alpha;
          }
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      // 6. Draw connection vertices (subtle mesh points)
      nodes.forEach(node => {
        const waveY = Math.sin(node.col * 0.35 - time * 1.3) * 16;
        const scale = fov / Math.max(50, fov + node.z);
        const projX = cx + (node.x - cx) * scale;
        const projY = cy + (node.y + waveY - cy) * scale;

        ctx.beginPath();
        const radius = (0.5 + node.intensity * 0.65) * scale;
        ctx.arc(projX, projY, Math.max(0.1, radius), 0, Math.PI * 2);
        
        ctx.fillStyle = `rgba(${node.color}, ${0.1 + node.intensity * 0.45})`;
        ctx.globalAlpha = scale;
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className={`portal-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 ${isOpen ? "open" : ""}`}
      onClick={handleBackdropClick}
    >
      <canvas 
        ref={canvasRef} 
        id="portal-webgl-canvas" 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-90"
      />
      
      <div 
        className={`relative z-10 mb-6 transform transition-all duration-700 delay-200 ${isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-mono font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <ShieldCheck weight="fill" /> Encrypted session
        </div>
      </div>

      <div ref={cardRef} className="portal-card relative z-10 p-7 sm:p-10" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-[#A1A1AA] hover:text-white transition-all hover:rotate-90 hover:scale-110 duration-300"
        >
          <X weight="regular" className="text-2xl" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-[32px] sm:text-[36px] font-space font-medium text-white mb-2 tracking-tight">Access Dashboard</h2>
          <p className="text-[#A1A1AA] text-sm sm:text-base font-sans">Verify your identity to proceed to the control panel.</p>
        </div>
        
        <div className="space-y-5">
          <button 
            type="button" 
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="portal-btn w-full font-sans font-medium py-4 mt-2 flex items-center justify-center gap-3 text-base tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Cloud className="text-xl" /> {isLoggingIn ? "Authenticating..." : "Sign in with Google Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}
