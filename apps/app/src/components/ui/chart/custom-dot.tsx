import { Dot } from "recharts";


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