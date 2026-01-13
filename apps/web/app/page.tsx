import { Hero } from "../components/dom/hero";


export default function Home() {
    return (
        <Hero
            badge={{
                icon: '🚀',
                text: '100K+ Top Investors Added',
            }}
            title="Unlock Investor"
            highlightedText="Connections in 2 mins"
            description="Access our comprehensive databases to find detailed contact information for over 100K+ VC and angel investors from top global markets."
            primaryButton={{
                label: 'Get Started Now',
                href: '/sign-up',
            }}
            secondaryButton={{
                label: 'Watch Demo',
                href: '/demo',
            }}
        />
    );
}
