import React, { useEffect, useRef } from 'react';

const MagneticCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse state with magnetic radius
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 200,
      isHovered: false
    };

    // Electromagnetic shockwaves created on click
    const ripples = [];

    // Particle representation
    class MagneticNode {
      constructor(originX, originY) {
        this.originX = originX;
        this.originY = originY;
        this.x = originX;
        this.y = originY;
        this.vx = 0;
        this.vy = 0;
        this.size = Math.random() * 1.5 + 1.0;
        this.spring = 0.045;
        this.friction = 0.88;
        this.color = Math.random() > 0.6 ? '#6366f1' : (Math.random() > 0.5 ? '#38bdf8' : '#818cf8');
        this.alpha = Math.random() * 0.25 + 0.15;
      }

      update() {
        // Distance from mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);

        // Magnetic Attraction effect
        if (dist < mouse.radius && mouse.isHovered) {
          const force = (1 - dist / mouse.radius) * 10;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
        }

        // Ripple / Shockwave physics
        for (let i = 0; i < ripples.length; i++) {
          const r = ripples[i];
          const rdx = this.x - r.x;
          const rdy = this.y - r.y;
          const rDist = Math.hypot(rdx, rdy);

          if (Math.abs(rDist - r.currentRadius) < 30) {
            const push = (1 - r.currentRadius / r.maxRadius) * 8;
            const angle = Math.atan2(rdy, rdx);
            this.vx += Math.cos(angle) * push;
            this.vy += Math.sin(angle) * push;
          }
        }

        // Spring force returning node to equilibrium
        const homeX = this.originX - this.x;
        const homeY = this.originY - this.y;
        this.vx += homeX * this.spring;
        this.vy += homeY * this.spring;

        // Apply damping
        this.vx *= this.friction;
        this.vy *= this.friction;

        // Update position
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize regular hexagonal / grid nodes
    let nodes = [];
    const initNodes = () => {
      nodes = [];
      const spacing = Math.max(60, Math.floor(Math.sqrt((width * height) / 160)));
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const jitterX = (Math.random() - 0.5) * 15;
          const jitterY = (Math.random() - 0.5) * 15;
          nodes.push(new MagneticNode(x + jitterX, y + jitterY));
        }
      }
    };

    initNodes();

    // Mouse event handlers
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        currentRadius: 10,
        maxRadius: 260,
        speed: 9
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.currentRadius += r.speed;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.currentRadius, 0, Math.PI * 2);
        const rippleAlpha = Math.max(0, 1 - r.currentRadius / r.maxRadius) * 0.2;
        ctx.strokeStyle = `rgba(99, 102, 241, ${rippleAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        if (r.currentRadius >= r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // Update & draw nodes
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
      }

      // Connect adjacent nodes with subtle force lines
      const maxConnectDist = 70;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.12;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Draw magnetic attraction filaments directly to mouse cursor
      if (mouse.isHovered) {
        for (let i = 0; i < nodes.length; i++) {
          const dx = mouse.x - nodes[i].x;
          const dy = mouse.y - nodes[i].y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouse.radius) {
            const filamentAlpha = (1 - dist / mouse.radius) * 0.28;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, mouse.x, mouse.y);
            gradient.addColorStop(0, `rgba(99, 102, 241, ${filamentAlpha * 0.4})`);
            gradient.addColorStop(1, `rgba(56, 189, 248, ${filamentAlpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Subtle mouse glow
        ctx.save();
        const aura = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 140);
        aura.addColorStop(0, 'rgba(99, 102, 241, 0.08)');
        aura.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
        aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="magnetic-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="magnetic-canvas" />
    </div>
  );
};

export default MagneticCanvas;
