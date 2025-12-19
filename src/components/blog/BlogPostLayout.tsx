import { ReactNode } from 'react'

interface BlogPostLayoutProps {
    children: ReactNode
    aside: ReactNode
}

export const BlogPostLayout = ({ children, aside }: BlogPostLayoutProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12 xl:gap-24 relative">
                {/* TOC Sidebar */}
                <aside className="relative border-r border-border/50">
                    {aside}
                </aside>

                {/* Blog Content */}
                <article className="min-w-0">
                    {children}
                </article>
            </div>
        </div>
    )
}
