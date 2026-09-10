"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type ThreeCanvasProps = {
  className?: string;
};

/**
 * Full-screen Three.js scene: camera, WebGL renderer, OrbitControls,
 * responsive resize, and a requestAnimationFrame render loop.
 * Brand-colored nodes form a soft “digital system” constellation.
 */
export default function ThreeCanvas({ className = "" }: ThreeCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x0e1f35, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // --- Scene + Camera ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1f35, 0.035);

    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / Math.max(mount.clientHeight, 1),
      0.1,
      100,
    );
    camera.position.set(0, 1.4, 7.5);

    // --- Lights ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffc107, 1.1);
    key.position.set(4, 6, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x4caf50, 0.55);
    fill.position.set(-5, 2, -2);
    scene.add(fill);

    // --- Scene content: growth constellation ---
    const root = new THREE.Group();
    scene.add(root);

    const brandMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x1e3a5f,
        metalness: 0.35,
        roughness: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        metalness: 0.25,
        roughness: 0.5,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffc107,
        metalness: 0.55,
        roughness: 0.3,
        emissive: 0xffc107,
        emissiveIntensity: 0.15,
      }),
    ];

    const geometries = [
      new THREE.IcosahedronGeometry(0.35, 0),
      new THREE.OctahedronGeometry(0.32, 0),
      new THREE.TetrahedronGeometry(0.38, 0),
      new THREE.SphereGeometry(0.28, 24, 24),
    ];

    const nodes: THREE.Mesh[] = [];
    const nodeCount = 18;
    for (let i = 0; i < nodeCount; i++) {
      const geo = geometries[i % geometries.length];
      const mat = brandMaterials[i % brandMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 1.6 + (i % 4) * 0.45;
      const y = Math.sin(i * 0.9) * 1.4;
      mesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.userData = {
        base: mesh.position.clone(),
        speed: 0.25 + (i % 5) * 0.08,
        phase: i * 0.55,
      };
      root.add(mesh);
      nodes.push(mesh);
    }

    // Central core — the “system”
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.7, 1),
      new THREE.MeshStandardMaterial({
        color: 0xffc107,
        metalness: 0.6,
        roughness: 0.25,
        emissive: 0xb38600,
        emissiveIntensity: 0.25,
        flatShading: true,
      }),
    );
    root.add(core);

    // Soft connecting lines between nearby nodes
    const linePositions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < 2.4) {
          linePositions.push(
            nodes[i].position.x,
            nodes[i].position.y,
            nodes[i].position.z,
            nodes[j].position.x,
            nodes[j].position.y,
            nodes[j].position.z,
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3),
    );
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({
        color: 0x4f7eb2,
        transparent: true,
        opacity: 0.35,
      }),
    );
    root.add(lines);

    // Ground ring for spatial reference
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(3.2, 0.02, 12, 96),
      new THREE.MeshBasicMaterial({ color: 0x2e7d32, transparent: true, opacity: 0.35 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.8;
    scene.add(ring);

    // --- Orbit Controls ---
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.enablePan = false;
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.55;
    controls.target.set(0, 0.2, 0);
    controls.update();

    // --- Resize ---
    const onResize = () => {
      const w = mount.clientWidth;
      const h = Math.max(mount.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h, false);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    window.addEventListener("resize", onResize);

    // --- Animation loop (rAF) ---
    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) {
        clock.start();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      if (!running) return;
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        core.rotation.y = t * 0.35;
        core.rotation.x = Math.sin(t * 0.4) * 0.15;
        root.rotation.y = t * 0.08;

        for (const mesh of nodes) {
          const { base, speed, phase } = mesh.userData as {
            base: THREE.Vector3;
            speed: number;
            phase: number;
          };
          mesh.position.y = base.y + Math.sin(t * speed + phase) * 0.22;
          mesh.rotation.x += 0.004 * speed;
          mesh.rotation.y += 0.006 * speed;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      controls.dispose();
      geometries.forEach((g) => g.dispose());
      brandMaterials.forEach((m) => m.dispose());
      lineGeo.dispose();
      (lines.material as THREE.Material).dispose();
      (core.geometry as THREE.BufferGeometry).dispose();
      (core.material as THREE.Material).dispose();
      (ring.geometry as THREE.BufferGeometry).dispose();
      (ring.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full touch-none ${className}`}
      role="img"
      aria-label="Interactive 3D visualization of a connected digital business system. Drag to rotate, scroll to zoom."
    />
  );
}
