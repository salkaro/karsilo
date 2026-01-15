"use client";

import {
    Box,
    Chart,
    useChart,
} from "@repo/ui";

import { Recharts } from "@repo/ui"


interface IChartData {
    month: string;
    revenue: number;
}

export const DemoChart = () => {
    const chartData: IChartData[] = [
        { month: "Jan", revenue: 8000 },
        { month: "Feb", revenue: 9200 },
        { month: "Mar", revenue: 7800 },
        { month: "Apr", revenue: 10500 },
        { month: "May", revenue: 9800 },
        { month: "Jun", revenue: 11200 },
        { month: "Jul", revenue: 10800 },
        { month: "Aug", revenue: 12455 },
    ];

    const chart = useChart({
        data: chartData,
        series: [{ name: "revenue", color: "purple.400" }],
    });

    return (
        <Box
            bg="#0b0b1a"
            p={6}
            borderRadius="xl"
            border="1px solid rgba(255, 255, 255, 0.2)"
            shadow="2xl"
            height={{base: "280px", xl: "400px",  "2xl": "500px"}}
        >
            <Recharts.ResponsiveContainer width="100%" height="100%">
                <Chart.Root chart={chart}>
                    <Recharts.AreaChart data={chart.data}>
                        {/* Gradient definition */}
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chart.color("purple.400")} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={chart.color("purple.400")} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        {/* Grid */}
                        <Recharts.CartesianGrid
                            stroke="rgba(255, 255, 255, 0.2)" // very subtle white
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        {/* X Axis */}
                        <Recharts.XAxis
                            dataKey="month"
                            tick={{ fill: chart.color("text.muted") }}
                            axisLine={false}
                            tickLine={false}
                        />

                        {/* Y Axis */}
                        <Recharts.YAxis
                            tickFormatter={chart.formatNumber({ style: "currency", currency: "USD", notation: "compact" })}
                            tick={{ fill: chart.color("text.muted") }}
                            axisLine={false}
                            tickLine={false}
                        />

                        {/* Tooltip (built-in) */}
                        <Recharts.Tooltip
                            contentStyle={{
                                backgroundColor: chart.color("bg.surface"),
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: "8px",
                            }}
                            labelStyle={{ color: chart.color("white") }}
                            formatter={(value) => {
                                if (typeof value !== "number") return ""
                                return chart.formatNumber({ style: "currency", currency: "USD" })(value)
                            }}
                        />

                        {/* Area series with gradient fill */}
                        <Recharts.Area
                            type="monotone"
                            dataKey={chart.key("revenue")}
                            stroke={chart.color("purple.400")}
                            fill="url(#revenueGradient)" // fade effect
                            strokeWidth={2}
                            dot={{ r: 4, fill: chart.color("purple.500") }}
                            activeDot={{ r: 6 }}
                        />
                    </Recharts.AreaChart>
                </Chart.Root>
            </Recharts.ResponsiveContainer>
        </Box>
    );
};
