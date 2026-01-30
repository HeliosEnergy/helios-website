import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, MeshWobbleMaterial, Float } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

function ShiftingForm() {
    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state) => {
        const time = state.clock.elapsedTime
        meshRef.current.rotation.x = time * 0.2
        meshRef.current.rotation.y = time * 0.3
    })

    return (
        <Icosahedron ref={meshRef} args={[1, 15]} scale={2}>
            <MeshWobbleMaterial
                color="#ffffff"
                emissive="#ffffff"
                emissiveIntensity={0.1}
                wireframe
                factor={0.4}
                speed={1}
            />
        </Icosahedron>
    )
}

export const MorphingGeometry = () => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                    <ShiftingForm />
                </Float>
            </Canvas>
        </div>
    )
}
