"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { NormalizedDataPoint, NormalizedPoint, SVGChartDataPoint, SVGChartSeries } from "./models";
import { CHART_PADDING, TOTAL_COLOR, TOTAL_ID } from "./constants";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/utils/formatters";
import { SVGCustomDot } from "./custom-dot";



export interface SVGChartProps {
    data: SVGChartDataPoint[];
    /** Series configuration (id, name, color) */
    series: SVGChartSeries[];
    /** Background color for the chart area */
    backgroundColor?: string;
    /** Show grid lines */
    showGrid?: boolean;
    /** Number of horizontal grid lines */
    gridLines?: number;
    /** Animate on hover */
    animated?: boolean;
    /** Currency */
    currency?: string;
    /** Show X axis labels (dates) at the bottom */
    showXAxis?: boolean;
    /** Show Y axis labels (values) on the left side */
    showYAxis?: boolean;
}


export function SVGChart({
    data,
    series,
    backgroundColor = "#111827",
    showGrid = true,
    gridLines = 4,
    animated = true,
    currency = "USD",
    showXAxis = false,
    showYAxis = false,
}: SVGChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [animatedProgress, setAnimatedProgress] = useState<number>(0);
    const animationRef = useRef<number | null>(null);
    const [dimensions, setDimensions] = useState({ width: 400, height: 150 });

    const showTotal = series.length > 1;

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const horizontalPadding = 32;
                const verticalPadding = 28;
                const availableWidth = Math.max(rect.width - horizontalPadding, 100);
                const availableHeight = Math.max(rect.height - verticalPadding, 80);
                setDimensions({
                    width: availableWidth,
                    height: availableHeight,
                });
            }
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const chartWidth = dimensions.width;
    const chartHeight = dimensions.height;
    const VIEWBOX_PADDING = 20;

    // Adjust padding based on axis visibility
    const X_AXIS_HEIGHT = showXAxis ? 28 : 0;
    const Y_AXIS_WIDTH = showYAxis ? 60 : 0;

    // Helper function to calculate nice rounded axis values
    const getNiceAxisValues = (min: number, max: number, tickCount: number) => {
        if (max === min) return { niceMin: 0, niceMax: max || 100, tickInterval: (max || 100) / tickCount };

        const range = max - min;
        const roughInterval = range / tickCount;

        // Find a nice interval (1, 2, 5, 10, 20, 50, 100, 200, 500, etc.)
        const magnitude = Math.pow(10, Math.floor(Math.log10(roughInterval)));
        const residual = roughInterval / magnitude;

        let niceInterval: number;
        if (residual <= 1) niceInterval = magnitude;
        else if (residual <= 2) niceInterval = 2 * magnitude;
        else if (residual <= 5) niceInterval = 5 * magnitude;
        else niceInterval = 10 * magnitude;

        // Calculate nice min and max
        const niceMin = Math.floor(min / niceInterval) * niceInterval;
        const niceMax = Math.ceil(max / niceInterval) * niceInterval;

        // Always start from 0 for revenue charts
        return {
            niceMin: Math.min(0, niceMin),
            niceMax: niceMax,
            tickInterval: niceInterval
        };
    };

    // Normalize all series data to chart coordinates (including total)
    const { normalizedData, niceMin, niceMax, tickInterval } = useMemo((): {
        normalizedData: NormalizedDataPoint[],
        niceMin: number,
        niceMax: number,
        tickInterval: number
    } => {
        if (data.length === 0 || series.length === 0) return { normalizedData: [], niceMin: 0, niceMax: 0, tickInterval: 0 };

        // Calculate totals for each data point
        const totals = data.map((point) => point.values.reduce((sum, v) => sum + v.value, 0));

        // Find global min/max across all series AND totals
        let min = Infinity;
        let max = -Infinity;
        data.forEach((point, idx) => {
            point.values.forEach((v) => {
                if (v.value < min) min = v.value;
                if (v.value > max) max = v.value;
            });
            // Include total in min/max calculation
            if (showTotal) {
                const total = totals[idx];
                if (total > max) max = total;
                if (total < min) min = total;
            }
        });

        if (min === Infinity) min = 0;
        if (max === -Infinity) max = 0;

        // Get nice rounded values for the axis
        const { niceMin: axisMin, niceMax: axisMax, tickInterval: interval } = getNiceAxisValues(min, max, gridLines);
        const range = axisMax - axisMin || 1;

        // Chart area excludes axis labels
        const chartAreaLeft = Y_AXIS_WIDTH;
        const chartAreaTop = CHART_PADDING.top;
        const chartAreaWidth = chartWidth - Y_AXIS_WIDTH - CHART_PADDING.right;
        const chartAreaHeight = chartHeight - X_AXIS_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;

        const normalized = data.map((point, index) => {
            const x = chartAreaLeft + (index / (data.length - 1 || 1)) * chartAreaWidth;

            const seriesData: Record<string, NormalizedPoint> = {};

            // Add individual series
            series.forEach((s, seriesIndex) => {
                const valueData = point.values[seriesIndex];
                if (valueData) {
                    const normalizedY = (valueData.value - axisMin) / range;
                    const y = chartAreaTop + chartAreaHeight - normalizedY * chartAreaHeight;
                    seriesData[s.id] = {
                        x,
                        y,
                        value: valueData.value,
                        displayValue: formatCurrency({ amount: valueData.value, currency }),
                    };
                }
            });

            // Add total series if multiple series
            if (showTotal) {
                const total = totals[index];
                const normalizedY = (total - axisMin) / range;
                const y = chartAreaTop + chartAreaHeight - normalizedY * chartAreaHeight;
                seriesData[TOTAL_ID] = {
                    x,
                    y,
                    value: total,
                    displayValue: formatCurrency({ amount: total, currency }),
                };
            }

            return {
                label: point.label,
                x,
                series: seriesData,
            };
        });

        return { normalizedData: normalized, niceMin: axisMin, niceMax: axisMax, tickInterval: interval };
    }, [data, series, chartWidth, chartHeight, showTotal, currency, X_AXIS_HEIGHT, Y_AXIS_WIDTH, gridLines]);

    // Calculate chart area bounds for rendering
    const chartAreaTop = CHART_PADDING.top;
    const chartAreaHeight = chartHeight - X_AXIS_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom;
    const chartAreaBottom = chartAreaTop + chartAreaHeight;

    const getLinePath = useCallback((points: { x: number; y: number }[]) => {
        if (points.length === 0) return "";
        return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
    }, []);

    const getSeriesPoints = useCallback(
        (seriesId: string) => {
            return normalizedData
                .map((d) => d.series[seriesId])
                .filter((p): p is NormalizedPoint => p !== undefined);
        },
        [normalizedData]
    );

    const getProgressPath = useCallback(
        (progress: number, seriesId: string) => {
            const points = getSeriesPoints(seriesId);
            if (progress <= 0 || points.length === 0) return "";

            const fullPoints = Math.floor(progress);
            const fraction = progress - fullPoints;

            const slicedPoints = points.slice(0, fullPoints + 1);
            if (slicedPoints.length === 0) return "";

            let path = getLinePath(slicedPoints);

            if (fraction > 0 && fullPoints < points.length - 1) {
                const p1 = points[fullPoints]!;
                const p2 = points[fullPoints + 1]!;
                const interpX = p1.x + (p2.x - p1.x) * fraction;
                const interpY = p1.y + (p2.y - p1.y) * fraction;
                path += ` L${interpX} ${interpY}`;
            }

            return path;
        },
        [getSeriesPoints, getLinePath]
    );

    const getProgressEndPoint = useCallback(
        (progress: number, seriesId: string) => {
            const points = getSeriesPoints(seriesId);
            if (progress <= 0 || points.length === 0) return points[0];

            const fullPoints = Math.floor(progress);
            const fraction = progress - fullPoints;

            if (fraction > 0 && fullPoints < points.length - 1) {
                const p1 = points[fullPoints]!;
                const p2 = points[fullPoints + 1]!;
                return {
                    x: p1.x + (p2.x - p1.x) * fraction,
                    y: p1.y + (p2.y - p1.y) * fraction,
                };
            }
            return points[Math.min(fullPoints, points.length - 1)];
        },
        [getSeriesPoints]
    );

    // Smooth withdraw animation when mouse leaves
    useEffect(() => {
        if (!animated) return;

        if (hoveredIndex === null && animatedProgress > 0) {
            const startProgress = animatedProgress;
            const startTime = performance.now();
            const duration = startProgress * 40;

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const t = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - t, 3);
                const newProgress = startProgress * (1 - easeOut);

                if (newProgress > 0.01) {
                    setAnimatedProgress(newProgress);
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setAnimatedProgress(0);
                    animationRef.current = null;
                }
            };

            animationRef.current = requestAnimationFrame(animate);
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
            };
        }
    }, [hoveredIndex, animated, animatedProgress]);

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current || normalizedData.length === 0) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        const viewBoxWidth = chartWidth + VIEWBOX_PADDING * 2;
        const svgWidth = rect.width;
        const relativeX = mouseX / svgWidth;
        const viewX = relativeX * viewBoxWidth - VIEWBOX_PADDING;
        const clampedX = Math.max(0, Math.min(chartWidth, viewX));

        let closestIndex = 0;
        let closestDist = Math.abs(clampedX - normalizedData[0]!.x);
        for (let i = 1; i < normalizedData.length; i++) {
            const dist = Math.abs(clampedX - normalizedData[i]!.x);
            if (dist < closestDist) {
                closestDist = dist;
                closestIndex = i;
            }
        }
        setHoveredIndex(closestIndex);
        if (animated) {
            setAnimatedProgress(closestIndex);
        }
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
    };

    // Include total row in tooltip height calculation
    const tooltipSeriesCount = showTotal ? series.length + 1 : series.length;

    const getTooltipPosition = useCallback(() => {
        if (hoveredIndex === null || normalizedData.length === 0) return { x: 0, y: 0, showBelow: false };

        const point = normalizedData[hoveredIndex];
        if (!point) return { x: 0, y: 0, showBelow: false };

        // Find the average y position across all series for this point
        const yValues = Object.values(point.series).map((s) => s.y);
        const avgY = yValues.length > 0 ? yValues.reduce((a, b) => a + b, 0) / yValues.length : chartHeight / 2;

        const showBelow = avgY < 60;
        const tooltipHeight = 20 + tooltipSeriesCount * 18;
        const yOffset = showBelow ? 55 : -(tooltipHeight + 10);

        let xPos = point.x;
        const tooltipWidth = 160;
        const margin = tooltipWidth / 2 + 10;
        if (xPos < margin) xPos = margin;
        if (xPos > chartWidth - margin) xPos = chartWidth - margin;

        return { x: xPos, y: avgY + yOffset, showBelow };
    }, [hoveredIndex, normalizedData, chartWidth, chartHeight, tooltipSeriesCount]);

    if (normalizedData.length === 0) {
        return (
            <div
                ref={containerRef}
                style={{
                    backgroundColor,
                    borderRadius: "12px",
                    padding: "24px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#9ca3af",
                }}
            >
                No data available
            </div>
        );
    }

    // Build all series to render (including total if applicable)
    const allSeries: SVGChartSeries[] = showTotal
        ? [...series, { id: TOTAL_ID, name: "Total", color: TOTAL_COLOR }]
        : series;

    return (
        <div
            ref={containerRef}
            style={{
                backgroundColor,
                borderRadius: "30px",
                padding: "12px 16px 16px",
                position: "relative",
                overflow: "hidden",
                height: "100%",
                width: "100%",
            }}
        >
            <svg
                ref={svgRef}
                width="100%"
                height={chartHeight}
                viewBox={`${-VIEWBOX_PADDING} 0 ${chartWidth + VIEWBOX_PADDING * 2} ${chartHeight}`}
                preserveAspectRatio="xMidYMid meet"
                style={{ cursor: "crosshair" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <defs>
                    {allSeries.map((s) => (
                        <linearGradient key={`grad-${s.id}`} id={`grad-${s.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={s.color} stopOpacity={s.id === TOTAL_ID ? "0.08" : "0.15"} />
                            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                        </linearGradient>
                    ))}
                    {allSeries.map((s) => (
                        <linearGradient
                            key={`gradHL-${s.id}`}
                            id={`gradHL-${s.id}`}
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor={s.color} stopOpacity={s.id === TOTAL_ID ? "0.3" : "0.5"} />
                            <stop offset="100%" stopColor={s.color} stopOpacity="0.1" />
                        </linearGradient>
                    ))}
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Grid lines */}
                {showGrid && (() => {
                    // Calculate number of ticks based on nice values
                    const numTicks = tickInterval > 0 ? Math.round((niceMax - niceMin) / tickInterval) : gridLines;
                    return Array.from({ length: numTicks + 1 }).map((_, i) => {
                        const y = chartAreaTop + chartAreaHeight - (i / numTicks) * chartAreaHeight;
                        return (
                            <line
                                key={i}
                                x1={Y_AXIS_WIDTH}
                                y1={y}
                                x2={chartWidth}
                                y2={y}
                                stroke="#374151"
                                strokeWidth="0.5"
                                strokeDasharray="4 4"
                            />
                        );
                    });
                })()}

                {/* Y Axis labels (values on the left) */}
                {showYAxis && (() => {
                    // Calculate number of ticks based on nice values
                    const numTicks = tickInterval > 0 ? Math.round((niceMax - niceMin) / tickInterval) : gridLines;
                    return Array.from({ length: numTicks + 1 }).map((_, i) => {
                        const value = niceMin + i * tickInterval;
                        // Format as compact currency (e.g., £100, £1K, £10K)
                        const formattedValue = formatCurrency({ amount: value, decimals: 0 })

                        const y = chartAreaTop + chartAreaHeight - (i / numTicks) * chartAreaHeight;
                        return (
                            <text
                                key={`y-axis-${i}`}
                                x={Y_AXIS_WIDTH - 16}
                                y={y + 4}
                                fill="#9ca3af"
                                fontSize="11"
                                textAnchor="end"
                                fontFamily="system-ui, sans-serif"
                            >
                                {formattedValue}
                            </text>
                        );
                    });
                })()}

                {/* X Axis labels (dates at the bottom) */}
                {showXAxis &&
                    normalizedData.map((point, i) => {
                        // Show fewer labels if there are many data points
                        const showEvery = normalizedData.length > 10 ? Math.ceil(normalizedData.length / 6) : 1;
                        if (i % showEvery !== 0 && i !== normalizedData.length - 1) return null;

                        return (
                            <text
                                key={`x-axis-${i}`}
                                x={point.x - 10}
                                y={chartAreaTop + chartAreaHeight + 32}
                                fill="#9ca3af"
                                fontSize="11"
                                textAnchor="middle"
                                fontFamily="system-ui, sans-serif"
                            >
                                {point.label}
                            </text>
                        );
                    })}

                {/* Render each series (individual series first, then total on top) */}
                {allSeries.map((s) => {
                    const points = getSeriesPoints(s.id);
                    if (points.length === 0) return null;

                    const isTotal = s.id === TOTAL_ID;
                    const linePath = getLinePath(points);
                    const firstX = points[0]?.x ?? Y_AXIS_WIDTH;
                    const lastX = points[points.length - 1]?.x ?? chartWidth;
                    const areaPath = linePath ? `${linePath} L${lastX} ${chartAreaBottom} L${firstX} ${chartAreaBottom} Z` : "";

                    return (
                        <g key={s.id}>
                            {/* Base area fill */}
                            <path
                                d={areaPath}
                                fill={`url(#grad-${s.id})`}
                                style={{ transition: "opacity 0.3s ease" }}
                                opacity={animated && (hoveredIndex !== null || animatedProgress > 0) ? 0.3 : 1}
                            />

                            {/* Highlighted area fill */}
                            {animated && (
                                <path
                                    d={
                                        animatedProgress > 0
                                            ? (() => {
                                                const progressPath = getProgressPath(animatedProgress, s.id);
                                                const endPoint = getProgressEndPoint(animatedProgress, s.id);
                                                if (!progressPath || !endPoint) return `M${firstX} ${chartAreaBottom} L${firstX} ${chartAreaBottom} Z`;
                                                return `${progressPath} L${endPoint.x} ${chartAreaBottom} L${firstX} ${chartAreaBottom} Z`;
                                            })()
                                            : `M${firstX} ${chartAreaBottom} L${firstX} ${chartAreaBottom} Z`
                                    }
                                    fill={`url(#gradHL-${s.id})`}
                                    style={{
                                        transition: "opacity 0.2s ease",
                                        opacity: hoveredIndex !== null || animatedProgress > 0 ? 1 : 0,
                                    }}
                                />
                            )}

                            {/* Main line */}
                            <path
                                d={linePath}
                                fill="none"
                                stroke={s.color}
                                strokeWidth={isTotal ? 2.5 : 2}
                                strokeDasharray={isTotal ? "6 3" : undefined}
                                style={{ transition: "opacity 0.2s ease" }}
                                opacity={animated && (hoveredIndex !== null || animatedProgress > 0) ? 0.4 : 1}
                            />

                            {/* Highlighted line segment */}
                            {animated && (hoveredIndex !== null || animatedProgress > 0) && (
                                <path
                                    d={getProgressPath(animatedProgress, s.id)}
                                    fill="none"
                                    stroke={s.color}
                                    strokeWidth={isTotal ? 3.5 : 3}
                                    strokeDasharray={isTotal ? "6 3" : undefined}
                                    filter="url(#glow)"
                                />
                            )}

                            {/* Data points - using SVGCustomDot component */}
                            {points.map((point, i) => (
                                <SVGCustomDot
                                    key={i}
                                    cx={point.x}
                                    cy={point.y}
                                    color={s.color}
                                    active={hoveredIndex === i}
                                    isTotal={isTotal}
                                />
                            ))}
                        </g>
                    );
                })}

                {/* Vertical indicator line */}
                {hoveredIndex !== null && normalizedData[hoveredIndex] && (
                    <line
                        x1={normalizedData[hoveredIndex]!.x}
                        y1={chartAreaTop}
                        x2={normalizedData[hoveredIndex]!.x}
                        y2={chartAreaBottom}
                        stroke="#8b5cf6"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity={0.6}
                        z={10}
                        style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
                    />
                )}

                {/* Multi-series Tooltip */}
                {hoveredIndex !== null &&
                    normalizedData[hoveredIndex] &&
                    (() => {
                        return (
                            <ChartTooltip
                                allSeries={allSeries}
                                normalizedData={normalizedData}
                                hoveredIndex={hoveredIndex}
                                tooltipSeriesCount={tooltipSeriesCount}
                                getTooltipPosition={getTooltipPosition}
                            />
                        )
                    })()}
            </svg>
        </div>
    );
}
