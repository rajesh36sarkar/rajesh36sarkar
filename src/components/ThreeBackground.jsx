import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Stars } from '@react-three/drei';

const RotatingCube = () => {
  const meshRef = useRef();
  useFrame(() => {
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.01;
  });
  return (
    <Box ref={meshRef} args={[1, 1, 1]} position={[-2, 0, 0]}>
      <meshStandardMaterial color="#667eea" wireframe />
    </Box>
  );
};

const RotatingSphere = () => {
  const sphereRef = useRef();
  useFrame(() => {
    sphereRef.current.rotation.y += 0.005;
  });
  return (
    <Sphere ref={sphereRef} args={[0.8, 32, 32]} position={[2, -0.5, -1]}>
      <meshStandardMaterial color="#764ba2" roughness={0.3} metalness={0.7} />
    </Sphere>
  );
};

const FloatingTorus = () => {
  const torusRef = useRef();
  let time = 0;
  useFrame(() => {
    time += 0.01;
    torusRef.current.rotation.x = Math.sin(time) * 0.5;
    torusRef.current.rotation.y = Math.cos(time) * 0.5;
    torusRef.current.position.y = Math.sin(time) * 0.3;
  });
  return (
    <mesh ref={torusRef} position={[0, 1, -2]}>
      <torusGeometry args={[0.8, 0.2, 16, 100]} />
      <meshStandardMaterial color="#f093fb" emissive="#4a00e0" emissiveIntensity={0.5} />
    </mesh>
  );
};

const ThreeBackground = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <RotatingCube />
        <RotatingSphere />
        <FloatingTorus />
        {/* ❌ Removed OrbitControls entirely – no draggable slider on any device */}
      </Canvas>
    </div>
  );
};

export default ThreeBackground;