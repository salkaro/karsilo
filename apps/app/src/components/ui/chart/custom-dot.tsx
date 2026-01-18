import { Dot } from "recharts";

// Recharts-compatible custom dot
export const renderActiveDot = (props: any) => <CustomDot {...props} active />;

export const CustomDot = (props: any) => {
    const { cx, cy, stroke, active } = props;

    if (!active) {
        return (
            <Dot
                cx={cx}
                cy={cy}
                r={3}
                fill={stroke}
                stroke="white"
                strokeWidth={1}
            />
        );
    }

    return (
        <g>
            {/* Outer glow */}
            <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.15} />
            {/* Inner bright dot */}
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={stroke}
                stroke="white"
                strokeWidth={2}
                filter="url(#glow)"
            />
        </g>
    );
};

// SVG Chart compatible custom dot (no Recharts dependency)
export interface SVGCustomDotProps {
    cx: number;
    cy: number;
    color: string;
    active?: boolean;
    isTotal?: boolean;
}

export const SVGCustomDot = ({ cx, cy, color, active, isTotal }: SVGCustomDotProps) => {
    if (!active) {
        return (
            <circle
                cx={cx}
                cy={cy}
                r={3}
                fill={color}
                stroke="white"
                strokeWidth={1}
                style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
        );
    }

    return (
        <g>
            {/* Outer glow */}
            <circle
                cx={cx}
                cy={cy}
                r={isTotal ? 8 : 10}
                fill={color}
                opacity={0.15}
                style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            {/* Inner bright dot */}
            <circle
                cx={cx}
                cy={cy}
                r={isTotal ? 4 : 6}
                fill={color}
                stroke="white"
                strokeWidth={2}
                filter="url(#glow)"
                style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
        </g>
    );
};