import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Stars } from '@react-three/drei';

const RotatingCube = () => {
  const meshRef = useRef();

  // Uses 'delta' clock time to ensure uniform speed on 60Hz, 120Hz, and 144Hz displays
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.3 * delta;
      meshRef.current.rotation.y += 0.6 * delta;
    }
  });

  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="#667eea" wireframe />
    </Box>
  );
};

const RotatingSphere = () => {
  const sphereRef = useRef();

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.3 * delta;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[2, -0.5, -1]}>
      <meshStandardMaterial color="#764ba2" roughness={0.3} metalness={0.7} />
    </Sphere>
  );
};

const FloatingTorus = () => {
  const torusRef = useRef();

  // Fixed time-reset layout glitch by using Three's native state clock reference
  useFrame((state) => {
    if (!torusRef.current) return;
    const elapsedTime = state.clock.getElapsedTime();
    
    torusRef.current.rotation.x = Math.sin(elapsedTime) * 0.5;
    torusRef.current.rotation.y = Math.cos(elapsedTime) * 0.5;
    torusRef.current.position.y = Math.sin(elapsedTime) * 0.3;
  });

  return (
    <mesh ref={torusRef} position={[0, 1, -2]}>
      {/* Reduced poly segments slightly from 100 to 64 to save mobile GPU drawing overhead */}
      <torusGeometry args={[0.8, 0.2, 12, 64]} />
      <meshStandardMaterial color="#f093fb" emissive="#4a00e0" emissiveIntensity={0.5} />
    </mesh>
  );
};

const ThreeBackground = () => {
  return (
    // Extracted heavy inline presentation objects out to your central application style sheet
    <div className="three-bg-canvas-container">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ powerPreference: "high-performance", antialias: false }} // WebGL hardware performance hints
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />
        <RotatingCube />
        <RotatingSphere />
        <FloatingTorus />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;