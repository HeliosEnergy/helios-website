import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
    label: string
    href?: string
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
    return (
        <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-8">
            <Link
                to="/"
                className="hover:text-foreground transition-colors p-1"
                aria-label="Home"
            >
                <Home className="w-3.5 h-3.5" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 opacity-40" />
                    {item.href ? (
                        <Link
                            to={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-xs lg:max-w-md">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    )
}
