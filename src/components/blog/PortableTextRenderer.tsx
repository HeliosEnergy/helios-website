import { PortableText, PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'

const components: PortableTextComponents = {
    block: {
        h2: ({ children, value }) => {
            const id = value.children?.[0]?.text?.toLowerCase().replace(/\s+/g, '-') || ''
            return (
                <h2 id={id} className="text-3xl font-heading font-bold mt-12 mb-6 text-foreground tracking-tight scroll-mt-24">
                    {children}
                </h2>
            )
        },
        h3: ({ children, value }) => {
            const id = value.children?.[0]?.text?.toLowerCase().replace(/\s+/g, '-') || ''
            return (
                <h3 id={id} className="text-2xl font-heading font-semibold mt-8 mb-4 text-foreground tracking-tight scroll-mt-24">
                    {children}
                </h3>
            )
        },
        h4: ({ children }) => (
            <h4 className="text-xl font-heading font-semibold mt-6 mb-3 text-foreground">
                {children}
            </h4>
        ),
        normal: ({ children }) => (
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-6 my-8 italic text-lg text-foreground bg-primary/5 py-4 px-6 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="list-disc pl-6 mb-6 space-y-3 text-lg text-muted-foreground">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="list-decimal pl-6 mb-6 space-y-3 text-lg text-muted-foreground">
                {children}
            </ol>
        ),
    },
    marks: {
        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        code: ({ children }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm text-foreground">
                {children}
            </code>
        ),
        link: ({ children, value }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium transition-colors"
            >
                {children}
            </a>
        ),
    },
    types: {
        image: ({ value }) => (
            <div className="my-10 overflow-hidden rounded-xl border border-border">
                <img
                    src={urlFor(value).url()}
                    alt={value.alt || 'Blog image'}
                    className="w-full h-auto object-cover"
                />
                {value.caption && (
                    <p className="p-4 text-sm text-muted-foreground text-center border-t border-border bg-muted/30">
                        {value.caption}
                    </p>
                )}
            </div>
        ),
        code: ({ value }) => (
            <div className="my-8 rounded-xl overflow-hidden border border-border bg-[#0D0D0D]">
                {value.title && (
                    <div className="px-4 py-2 border-b border-white/10 bg-white/5 text-xs font-mono text-white/50 flex justify-between items-center">
                        <span>{value.title}</span>
                        <span className="uppercase">{value.language}</span>
                    </div>
                )}
                <pre className="p-6 overflow-x-auto">
                    <code className="text-sm font-mono text-white leading-relaxed">
                        {value.code}
                    </code>
                </pre>
            </div>
        ),
    },
}

export const PortableTextRenderer = ({ value }: { value: any }) => {
    return <PortableText value={value} components={components} />
}
