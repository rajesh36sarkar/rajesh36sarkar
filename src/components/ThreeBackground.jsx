import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Stars } from '@react-three/drei';

/* =========================
   ROTATING CUBE (OPTIMIZED)
========================= */
const RotatingCube = () => {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    meshRef.current.rotation.x += 0.2 * delta;
    meshRef.current.rotation.y += 0.4 * delta;
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="#667eea" wireframe />
    </Box>
  );
};

/* =========================
   ROTATING SPHERE (OPTIMIZED)
========================= */
const RotatingSphere = () => {
  const sphereRef = useRef();

  useFrame((_, delta) => {
    if (!sphereRef.current) return;
    sphereRef.current.rotation.y += 0.25 * delta;
  });

  return (
    <Sphere ref={sphereRef} args={[0.7, 24, 24]} position={[2, -0.5, -1]}>
      <meshStandardMaterial color="#764ba2" roughness={0.4} metalness={0.6} />
    </Sphere>
  );
};

/* =========================
   FLOATING TORUS (OPTIMIZED)
========================= */
const FloatingTorus = () => {
  const torusRef = useRef();

  useFrame((state) => {
    if (!torusRef.current) return;

    const t = state.clock.getElapsedTime();

    torusRef.current.rotation.x = Math.sin(t * 0.5) * 0.4;
    torusRef.current.rotation.y = Math.cos(t * 0.5) * 0.4;
    torusRef.current.position.y = Math.sin(t) * 0.25;
  });

  return (
    <mesh ref={torusRef} position={[0, 1, -2]}>
      <torusGeometry args={[0.7, 0.18, 10, 48]} />
      <meshStandardMaterial
        color="#f093fb"
        emissive="#4a00e0"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

/* =========================
   MAIN SCENE
========================= */
const ThreeBackground = () => {
  return (
    <div className="three-bg-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        dpr={[1, 1.5]} // 🔥 IMPORTANT: prevents GPU overload
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
        }}
      >
        {/* LIGHTS (minimal for performance) */}
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />

        {/* BACKGROUND STARS (HEAVILY REDUCED) */}
        <Stars
          radius={50}
          depth={30}
          count={1200}   // 🔥 reduced from 3000
          factor={3}
          fade
          speed={0.5}
        />

        {/* SAFE LOADING WRAPPER */}
        <Suspense fallback={null}>
          <RotatingCube />
          <RotatingSphere />
          <FloatingTorus />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeBackground;