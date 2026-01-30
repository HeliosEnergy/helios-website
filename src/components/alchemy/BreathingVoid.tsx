import { PaperTexture, SimplexNoise } from '@paper-design/shaders-react'
import { motion } from 'framer-motion'

export const BreathingVoid = () => {
    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-black rounded-[40px] border border-white/5">
            <div className="absolute inset-0">
                <SimplexNoise
                    opacity={0.05}
                    animate={true}
                />
            </div>
            <div className="absolute inset-0">
                <PaperTexture
                    opacity={0.08}
                    animate={true}
                />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-96 h-96 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/40 mb-4 block italic">The Infinite</span>
                <h3 className="text-4xl font-heading font-medium tracking-tightest leading-none text-white/80">
                    Listen to the silence.
                </h3>
            </div>
        </div>
    )
}
