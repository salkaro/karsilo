'use client';

import { createSystem, ChakraProvider, defaultConfig, defineConfig } from "@repo/ui/index";
import { SessionProvider } from "next-auth/react";
import { EmotionCacheProvider } from "./emotion";


const config = defineConfig({
    globalCss: {
        html: {
            colorPalette: 'brand',
        },
        button: {
            fontWeight: '500',
        },
    },
    theme: {
        tokens: {
            fonts: {
                body: { value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
                heading: { value: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
            },

            fontWeights: {
                normal: { value: '400' },
                medium: { value: '500' },
                semibold: { value: '600' },
                bold: { value: '700' },
            },

            colors: {
                // Stripe-style gray scale
                gray: {
                    25: { value: '#fcfcfd' },
                    50: { value: '#f9fafb' },
                    100: { value: '#f2f4f7' },
                    200: { value: '#eaecf0' },
                    300: { value: '#d0d5dd' },
                    400: { value: '#98a2b3' },
                    500: { value: '#667085' },
                    600: { value: '#475467' },
                    700: { value: '#344054' },
                    800: { value: '#1d2939' },
                    900: { value: '#101828' },
                },

                // Stripe purple
                brand: {
                    25: { value: '#faf5ff' },
                    50: { value: '#f5f3ff' },
                    100: { value: '#ede9fe' },
                    200: { value: '#ddd6fe' },
                    300: { value: '#c4b5fd' },
                    400: { value: '#a78bfa' },
                    500: { value: '#8b5cf6' }, // Primary purple
                    600: { value: '#7c3aed' },
                    700: { value: '#6d28d9' },
                    800: { value: '#5b21b6' },
                    900: { value: '#4c1d95' },
                },

                success: {
                    500: { value: '#12b76a' },
                },
                warning: {
                    500: { value: '#f79009' },
                },
                danger: {
                    500: { value: '#f04438' },
                },
            },

            radii: {
                xs: { value: '4px' },
                sm: { value: '6px' },
                md: { value: '8px' },
                lg: { value: '12px' },
                xl: { value: '16px' },
            },

            shadows: {
                xs: { value: '0 1px 2px rgba(16, 24, 40, 0.05)' },
                sm: { value: '0 1px 3px rgba(16, 24, 40, 0.1)' },
                md: { value: '0 4px 8px rgba(16, 24, 40, 0.08)' },
                lg: { value: '0 12px 24px rgba(16, 24, 40, 0.12)' },
            },
        },

        semanticTokens: {
            colors: {
                bg: {
                    DEFAULT: { value: 'white' },
                    subtle: { value: '{colors.gray.50}' },
                    muted: { value: '{colors.gray.100}' },
                    canvas: { value: '{colors.gray.25}' },
                },

                fg: {
                    DEFAULT: { value: '{colors.gray.900}' },
                    muted: { value: '{colors.gray.600}' },
                    subtle: { value: '{colors.gray.500}' },
                },

                border: {
                    DEFAULT: { value: '{colors.gray.200}' },
                    subtle: { value: '{colors.gray.100}' },
                    emphasized: { value: '{colors.gray.300}' },
                },

                colorPalette: {
                    solid: { value: '{colors.brand.600}' },
                    contrast: { value: 'white' },
                    fg: { value: '{colors.gray.900}' },
                    muted: { value: '{colors.brand.100}' },
                    subtle: { value: '{colors.brand.50}' },
                    emphasized: { value: '{colors.brand.700}' },
                    focusRing: { value: '{colors.brand.500}' },
                },
            },
        },
    },
})


const system = createSystem(defaultConfig, config)

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <EmotionCacheProvider>
            <SessionProvider>
                <ChakraProvider value={system}>
                    {children}
                </ChakraProvider>
            </SessionProvider>
        </EmotionCacheProvider>
    );
}