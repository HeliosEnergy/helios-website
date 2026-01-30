import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 5000 }) {
    const mesh = useRef<THREE.Points>(null!)

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        return positions
    }, [count])

    useFrame((state) => {
        const time = state.clock.elapsedTime
        mesh.current.rotation.y = time * 0.05
        mesh.current.rotation.x = time * 0.02

        // Subtle movement to simulate "weather"
        const positionAttribute = mesh.current.geometry.getAttribute('position')
        for (let i = 0; i < count; i++) {
            const x = positionAttribute.getX(i)
            const y = positionAttribute.getY(i)
            const z = positionAttribute.getZ(i)

            positionAttribute.setX(i, x + Math.sin(time + i) * 0.001)
            positionAttribute.setY(i, y + Math.cos(time + i) * 0.001)
        }
        positionAttribute.needsUpdate = true
    })

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation
            />
        </points>
    )
}

export const ParticleWeather = () => {
    return (
        <div className="w-full h-full min-h-[400px] bg-black">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <Particles />
            </Canvas>
        </div>
    )
}
