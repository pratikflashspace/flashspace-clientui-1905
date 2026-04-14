import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface UAEParticlesProps {
  scrollY?: number;
}

/**
 * Three.js floating particle field — reacts to scroll.
 * Gold + white particles drift in 3D, gently rotating as user scrolls.
 */
const UAEParticles: React.FC<UAEParticlesProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ─── Scene ─── */
    const scene    = new THREE.Scene();
    const w        = el.offsetWidth;
    const h        = el.offsetHeight;
    const camera   = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ─── Particles ─── */
    const COUNT     = 700;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const colors    = new Float32Array(COUNT * 3);

    const gold  = new THREE.Color('#FFC700');
    const white = new THREE.Color('#ffffff');
    const green = new THREE.Color('#35503f');

    for (let i = 0; i < COUNT; i++) {
      const r   = 40 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 0.4 + Math.random() * 1.2;

      /* color: 55% gold, 30% white, 15% green */
      const pick = Math.random();
      const col  = pick < 0.55 ? gold : pick < 0.85 ? white : green;
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));
    geo.setAttribute('size',     new THREE.BufferAttribute(sizes,     1));

    const mat = new THREE.PointsMaterial({
      vertexColors:   true,
      sizeAttenuation: true,
      size:            1.4,
      transparent:     true,
      opacity:         0.75,
      depthWrite:      false,
      blending:        THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    /* ─── Lines connecting nearby particles─── */
    const lineMat = new THREE.LineBasicMaterial({
      color:       0xFFC700,
      transparent: true,
      opacity:     0.06,
      blending:    THREE.AdditiveBlending,
    });
    const linePositions: number[] = [];
    const posArr = positions;
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = posArr[i*3] - posArr[j*3];
        const dy = posArr[i*3+1] - posArr[j*3+1];
        const dz = posArr[i*3+2] - posArr[j*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (dist < 18) {
          linePositions.push(
            posArr[i*3], posArr[i*3+1], posArr[i*3+2],
            posArr[j*3], posArr[j*3+1], posArr[j*3+2]
          );
        }
      }
    }

    if (linePositions.length > 0) {
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(lines);
    }

    /* ─── Mouse parallax ─── */
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    /* ─── Scroll rotation ─── */
    let scrollRot = 0;
    const onScroll = () => {
      scrollRot = window.scrollY * 0.0008;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ─── Resize ─── */
    const onResize = () => {
      const nw = el.offsetWidth;
      const nh = el.offsetHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    /* ─── Animation loop ─── */
    let animId: number;
    let t = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.0035;

      // Slow base rotation + scroll contribution
      particles.rotation.y = t * 0.12 + scrollRot;
      particles.rotation.x = Math.sin(t * 0.07) * 0.15 + mouseY * 0.06;
      particles.rotation.z = Math.cos(t * 0.05) * 0.08 + mouseX * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    /* ─── Cleanup ─── */
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default UAEParticles;
