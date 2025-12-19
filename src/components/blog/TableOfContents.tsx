import { useState, useEffect } from 'react'

interface TocItem {
    id: string
    text: string
    level: number
}

export const TableOfContents = ({ content }: { content: any[] }) => {
    const [activeId, setActiveId] = useState<string>('')
    const [items, setItems] = useState<TocItem[]>([])

    useEffect(() => {
        // Extract H2 and H3 headings from blocks
        const headings: TocItem[] = content
            .filter((block: any) => block._type === 'block' && ['h2', 'h3'].includes(block.style))
            .map((block: any) => {
                const text = block.children?.map((c: any) => c.text).join('') || ''
                const id = text.toLowerCase().replace(/\s+/g, '-')
                return {
                    id,
                    text,
                    level: block.style === 'h2' ? 2 : 3
                }
            })
        setItems(headings)

        // Setup intersection observer for scrolling
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id)
                    }
                })
            },
            { rootMargin: '-64px 0px -70% 0px' }
        )

        headings.forEach((heading) => {
            const element = document.getElementById(heading.id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [content])

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        const element = document.getElementById(id)
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            })
            setActiveId(id)
        }
    }

    if (items.length === 0) return null

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-6 hidden lg:block">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6 font-bold">
                Table of Contents
            </h4>
            <ul className="space-y-4">
                {items.map((item) => (
                    <li
                        key={item.id}
                        style={{ paddingLeft: item.level === 3 ? '1rem' : '0' }}
                    >
                        <a
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={`block text-sm transition-all duration-200 leading-snug ${activeId === item.id
                                    ? 'text-primary font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
