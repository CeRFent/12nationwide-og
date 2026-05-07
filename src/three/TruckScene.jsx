import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../components/ErrorBoundary';

const CanvasLoader = () => (
  <div className="canvas-loader">
    <div className="spinner" />
  </div>
);

const Truck = () => {
  const truckRef = useRef();

  useFrame(() => {
    if (truckRef.current) {
      truckRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={truckRef}>
      {/* Chassis/Floor */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.1, 4.5]} />
        <meshStandardMaterial color="#0A0A0A" />
      </mesh>

      {/* Cargo Box */}
      <mesh position={[0, 1.5, -0.5]}>
        <boxGeometry args={[1.8, 2, 3.5]} />
        <meshStandardMaterial color="#1B3A42" />
        {/* Trim Lines (simplified with nested mesh) */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.81, 0.05, 3.51]} />
          <meshStandardMaterial color="#6E7C80" />
        </mesh>
      </mesh>

      {/* Cab */}
      <mesh position={[0, 1, 1.5]}>
        <boxGeometry args={[1.6, 1.4, 1]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Wheels */}
      {[
        [-0.9, 0.4, 1.2], [0.9, 0.4, 1.2],   // Front
        [-0.9, 0.4, -1.2], [0.9, 0.4, -1.2]  // Rear
      ].map((pos, idx) => (
        <group key={idx} position={pos} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
            <meshStandardMaterial color="#0A0A0A" />
          </mesh>
          {/* Rim Ring */}
          <mesh position={[0, 0.16, 0]}>
            <torusGeometry args={[0.25, 0.02, 16, 32]} />
            <meshStandardMaterial color="#C4C9CC" />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[[-0.6, 0.8, 2], [0.6, 0.8, 2]].map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2} />
        </mesh>
      ))}

      {/* Side Text */}
      <Text
        position={[0.91, 1.5, -0.5]}
        rotation={[0, Math.PI / 2, 0]}
        fontSize={0.3}
        color="#F2F4F5"
        font="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK7jtWnitVvMoPw.woff"
      >
        12 NATIONWIDE
      </Text>
      <Text
        position={[-0.91, 1.5, -0.5]}
        rotation={[0, -Math.PI / 2, 0]}
        fontSize={0.3}
        color="#F2F4F5"
        font="https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK7jtWnitVvMoPw.woff"
      >
        12 NATIONWIDE
      </Text>
    </group>
  );
};

const Particles = () => {
  const points = useMemo(() => {
    const p = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    pointsRef.current.rotation.y += 0.001;
    pointsRef.current.rotation.x += 0.0005;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#D9DDDF" transparent opacity={0.6} />
    </points>
  );
};

export default function TruckScene() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<CanvasLoader />}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={45} />
          <OrbitControls enableZoom={false} autoRotate={false} />
          
          <ambientLight intensity={0.4} color="#8A989C" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            color="#FFFFFF" 
            castShadow 
          />
          
          <Truck />
          <Particles />
          
          <gridHelper args={[20, 20, "#1B3A42", "#1B3A42"]} position={[0, 0, 0]} />
          
          <fog attach="fog" args={["#0F2A33", 5, 15]} />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
}
