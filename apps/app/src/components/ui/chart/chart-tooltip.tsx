import { TOTAL_ID } from "./constants";
import { NormalizedDataPoint, SVGChartSeries } from "./models";

interface IChartToolTip {
    allSeries: SVGChartSeries[];
    normalizedData: NormalizedDataPoint[];
    hoveredIndex: number;
    tooltipSeriesCount: number;
    getTooltipPosition: () => { x: number, y: number, showBelow: boolean };
}

export const ChartTooltip: React.FC<IChartToolTip> = ({ allSeries, normalizedData, hoveredIndex, tooltipSeriesCount, getTooltipPosition }) => {
    const tooltipPos = getTooltipPosition();
    const point = normalizedData[hoveredIndex]!;

    const rowHeight = 18;   // content height
    const rowGap = 6;      // spacing between rows
    const rowPitch = rowHeight + rowGap;

    const headerHeight = 24;        // title + padding
    const footerPadding = 10;      // bottom breathing room

    const tooltipWidth = 200;
    const tooltipHeight = headerHeight + tooltipSeriesCount * rowPitch + footerPadding;


    return (
        <g
            style={{
                transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            transform={`translate(${tooltipPos.x}, ${tooltipPos.y})`}
        >
            <rect
                x={-tooltipWidth / 2}
                y={0}
                width={tooltipWidth}
                height={tooltipHeight}
                rx={6}
                fill="#1f2937"
                stroke="#374151"
                strokeWidth={1}
            />
            <polygon
                points={
                    tooltipPos.showBelow
                        ? "-6,0 6,0 0,-7"
                        : `-6,${tooltipHeight} 6,${tooltipHeight} 0,${tooltipHeight + 7}`
                }
                fill="#1f2937"
            />
            <text x={0} y={20} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                {point.label}
            </text>
            {allSeries.map((s, i) => {
                const seriesPoint = point.series[s.id];
                if (!seriesPoint) return null;
                const isTotal = s.id === TOTAL_ID;

                const y = 24 + i * rowPitch;

                return (
                    <g key={s.id}>
                        {isTotal && (
                            <line
                                x1={-tooltipWidth / 2 + 8}
                                y1={y}
                                x2={tooltipWidth / 2 - 8}
                                y2={24 + i * 18}
                                stroke="#374151"
                                strokeWidth={1}
                            />
                        )}
                        <circle
                            cx={-tooltipWidth / 2 + 12}
                            cy={y + 8}
                            r={4}
                            fill={s.color}
                            stroke={isTotal ? "#374151" : undefined}
                        />
                        <text
                            x={-tooltipWidth / 2 + 22}
                            y={y + 12}
                            fill={isTotal ? "#e5e7eb" : "#9ca3af"}
                            fontSize="10"
                            fontWeight={isTotal ? "bold" : "normal"}
                        >
                            {s.name}:
                        </text>
                        <text
                            x={tooltipWidth / 2 - 8}
                            y={y + 12}
                            textAnchor="end"
                            fill="white"
                            fontSize="10"
                            fontWeight="bold"
                        >
                            {seriesPoint.displayValue}
                        </text>
                    </g>
                );
            })}
        </g>
    );
};