export interface NormalizedPoint {
    x: number;
    y: number;
    value: number;
    displayValue: string;
}

export interface NormalizedDataPoint {
    label: string;
    x: number;
    series: Record<string, NormalizedPoint>;
}

export interface SVGChartDataPoint {
    label: string;
    values: { value: number; displayValue?: string }[];
}

export interface SVGChartSeries {
    id: string;
    name: string;
    color: string;
}
