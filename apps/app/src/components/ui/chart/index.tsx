"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { NormalizedDataPoint, NormalizedPoint, SVGChartDataPoint, SVGChartSeries } from "./models";
import { CHART_PADDING, TOTAL_COLOR, TOTAL_ID } from "./constants";
import { ChartTooltip } from "./chart-tooltip";
import { formatCurrency } from "@/utils/formatters";



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
}


export function SVGChart({
    data,
    series,
    backgroundColor = "#111827",
    showGrid = true,
    gridLines = 4,
    animated = true,
    currency = "USD"
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

    // Normalize all series data to chart coordinates (including total)
    const normalizedData = useMemo((): NormalizedDataPoint[] => {
        if (data.length === 0 || series.length === 0) return [];

        // Calculate totals for each data point
        const totals = data.map((point) => point.values.reduce((sum, v) => sum + v.value, 0));

        // Find global min/max across all series AND totals
        let minValue = Infinity;
        let maxValue = -Infinity;
        data.forEach((point, idx) => {
            point.values.forEach((v) => {
                if (v.value < minValue) minValue = v.value;
                if (v.value > maxValue) maxValue = v.value;
            });
            // Include total in min/max calculation
            if (showTotal) {
                const total = totals[idx];
                if (total > maxValue) maxValue = total;
                if (total < minValue) minValue = total;
            }
        });

        if (minValue === Infinity) minValue = 0;
        if (maxValue === -Infinity) maxValue = 0;
        const range = maxValue - minValue || 1;

        const availableWidth = chartWidth - CHART_PADDING.left - CHART_PADDING.right;
        const availableHeight = chartHeight - CHART_PADDING.top - CHART_PADDING.bottom;

        return data.map((point, index) => {
            const x = CHART_PADDING.left + (index / (data.length - 1 || 1)) * availableWidth;

            const seriesData: Record<string, NormalizedPoint> = {};

            // Add individual series
            series.forEach((s, seriesIndex) => {
                const valueData = point.values[seriesIndex];
                if (valueData) {
                    const normalizedY = (valueData.value - minValue) / range;
                    const y = CHART_PADDING.top + availableHeight - normalizedY * availableHeight;
                    seriesData[s.id] = {
                        x,
                        y,
                        value: valueData.value,
                        displayValue: formatCurrency(valueData.value, currency),
                    };
                }
            });

            // Add total series if multiple series
            if (showTotal) {
                const total = totals[index];
                const normalizedY = (total - minValue) / range;
                const y = CHART_PADDING.top + availableHeight - normalizedY * availableHeight;
                seriesData[TOTAL_ID] = {
                    x,
                    y,
                    value: total,
                    displayValue: formatCurrency(total, currency),
                };
            }

            return {
                label: point.label,
                x,
                series: seriesData,
            };
        });
    }, [data, series, chartWidth, chartHeight, showTotal, currency]);

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
                {showGrid &&
                    Array.from({ length: gridLines + 1 }).map((_, i) => (
                        <line
                            key={i}
                            x1="0"
                            y1={(i * chartHeight) / gridLines}
                            x2={chartWidth}
                            y2={(i * chartHeight) / gridLines}
                            stroke="#374151"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                        />
                    ))}

                {/* Render each series (individual series first, then total on top) */}
                {allSeries.map((s) => {
                    const points = getSeriesPoints(s.id);
                    if (points.length === 0) return null;

                    const isTotal = s.id === TOTAL_ID;
                    const linePath = getLinePath(points);
                    const areaPath = linePath ? `${linePath} L${chartWidth} ${chartHeight} L0 ${chartHeight} Z` : "";

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
                                                  if (!progressPath || !endPoint) return `M0 ${chartHeight} L0 ${chartHeight} Z`;
                                                  return `${progressPath} L${endPoint.x} ${chartHeight} L0 ${chartHeight} Z`;
                                              })()
                                            : `M0 ${chartHeight} L0 ${chartHeight} Z`
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

                            {/* Data points */}
                            {points.map((point, i) => (
                                <circle
                                    key={i}
                                    cx={point.x}
                                    cy={point.y}
                                    r={hoveredIndex === i ? (isTotal ? 6 : 8) : isTotal ? 3 : 4}
                                    fill={s.color}
                                    stroke={isTotal ? "#111827" : "white"}
                                    strokeWidth={hoveredIndex === i ? 3 : 2}
                                    style={{ transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
                                    filter={hoveredIndex === i ? "url(#glow)" : undefined}
                                />
                            ))}
                        </g>
                    );
                })}

                {/* Vertical indicator line */}
                {hoveredIndex !== null && normalizedData[hoveredIndex] && (
                    <line
                        x1={normalizedData[hoveredIndex]!.x}
                        y1={0}
                        x2={normalizedData[hoveredIndex]!.x}
                        y2={chartHeight}
                        stroke="#8b5cf6"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        opacity={0.6}
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
