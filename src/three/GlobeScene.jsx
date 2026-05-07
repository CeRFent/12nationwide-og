import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import ErrorBoundary from '../components/ErrorBoundary';

const CanvasLoader = () => (
  <div className="canvas-loader">
    <div className="spinner" />
  </div>
);

const cities = [
  { name: 'New York', lat: 40.7128, lng: -74.0060 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
  { name: 'Houston', lat: 29.7604, lng: -95.3698 },
  { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
  { name: 'Atlanta', lat: 33.7490, lng: -84.3880 },
  { name: 'Miami', lat: 25.7617, lng: -80.1918 },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321 },
];

const latLongToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
};

const Arc = ({ start, end }) => {
  const curve = useMemo(() => {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    mid.normalize().multiplyScalar(2 + distance * 0.4); // Push mid point out for arc
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.005, 8, false]} />
      <meshBasicMaterial color="#8A989C" transparent opacity={0.4} />
    </mesh>
  );
};

const Globe = () => {
  const globeRef = useRef();
  const texture = useTexture('https://unpkg.com/three-globe/example/img/earth-dark.jpg');
  const [hoveredCity, setHoveredCity] = useState(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  const cityMarkers = useMemo(() => {
    return cities.map(city => ({
      ...city,
      pos: latLongToVector3(city.lat, city.lng, 2)
    }));
  }, []);

  return (
    <group ref={globeRef}>
      {/* Main Globe */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={1} metalness={0} />
      </mesh>

      {/* Atmosphere Glow */}
      <mesh>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial color="#1B3A42" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {/* City Markers */}
      {cityMarkers.map((city, i) => (
        <group key={i} position={city.pos}>
          <mesh 
            onPointerOver={() => setHoveredCity(city.name)}
            onPointerOut={() => setHoveredCity(null)}
          >
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#C4C9CC" emissiveIntensity={2} />
          </mesh>
          {hoveredCity === city.name && (
            <Html distanceFactor={10} position={[0, 0.1, 0]}>
              <div className="bg-[#0F2A33] text-[#F2F4F5] px-2 py-1 text-xs rounded whitespace-nowrap border border-[#6E7C80]/30 font-mono uppercase tracking-widest">
                {city.name}
              </div>
            </Html>
          )}
        </group>
      ))}

      {/* Arcs (Routes) - Connect first city to others for simplicity */}
      {cityMarkers.slice(1).map((city, i) => (
        <Arc key={i} start={cityMarkers[0].pos} end={city.pos} />
      ))}
    </group>
  );
};

export default function GlobeScene() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<CanvasLoader />}>
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            enableZoom={false} 
            autoRotate={false}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Globe />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
}
