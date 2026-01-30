import { Canvas } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei'

export const SolarOrb = ({ color = "#FF6B35", size = 1 }) => {
    return (
        <div className="w-full h-full min-h-[400px]">
            <Canvas camera={{ position: [0, 0, 3] }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <Sphere args={[size, 64, 64]}>
                        <MeshDistortMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.5}
                            distort={0.4}
                            speed={2}
                            roughness={0.2}
                            metalness={0.8}
                        />
                    </Sphere>
                </Float>
            </Canvas>
        </div>
    )
}
