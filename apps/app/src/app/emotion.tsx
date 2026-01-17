"use client"

import { CacheProvider } from "@emotion/react"
import createCache from "@emotion/cache"
import { useServerInsertedHTML } from "next/navigation"
import { useState } from "react"

export function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
    const [cache] = useState(() => {
        const cache = createCache({ key: "css" })
        cache.compat = true
        return cache
    })

    useServerInsertedHTML(() => {
        const entries = Object.entries(cache.inserted)
        if (entries.length === 0) {
            return null
        }

        const names: string[] = []
        let styles = ""

        for (const [name, style] of entries) {
            if (typeof style === "string") {
                names.push(name)
                styles += style
            }
        }

        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        )
    })

    return <CacheProvider value={cache}>{children}</CacheProvider>
}
