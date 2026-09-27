'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/** 生日主体：轻量 Three.js 金色氛围球，不承载足球或人物叙事。 */
export function ThreeAmbientOrb() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 700px)').matches) return;
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 4.5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);
    const globe = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 2), new THREE.MeshBasicMaterial({ color: 0xd4af37, wireframe: true, transparent: true, opacity: 0.18 }));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.012, 6, 80), new THREE.MeshBasicMaterial({ color: 0xf2d783, transparent: true, opacity: 0.28 }));
    ring.rotation.x = 1.14;
    scene.add(globe, ring);
    let animationFrame = 0;
    const render = () => { animationFrame = requestAnimationFrame(render); globe.rotation.y += 0.002; globe.rotation.x += 0.0008; ring.rotation.z -= 0.0012; renderer.render(scene, camera); };
    render();
    const resize = () => { camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animationFrame); window.removeEventListener('resize', resize); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, []);

  return <div ref={mount} className="three-ambient" aria-hidden="true" />;
}
