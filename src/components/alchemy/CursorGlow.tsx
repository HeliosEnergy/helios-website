import { useEffect, useState } from 'react'

export const CursorGlow = () => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 })

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouse)
        return () => window.removeEventListener('mousemove', handleMouse)
    }, [])

    return (
        <div
            className="fixed inset-0 pointer-events-none z-[100]"
            style={{
                background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.08), transparent 80%)`,
                transition: 'background 0.3s ease-out'
            }}
        />
    )
}
