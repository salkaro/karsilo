"use client";

import { useMemo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
} from "react-simple-maps";
import { Box, HStack, VStack, Text, Skeleton, Flex } from "@repo/ui";

// TopoJSON URL for world map
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export interface CountryData {
    countryCode: string; // ISO 3166-1 alpha-2 (e.g., "US", "GB", "DE")
    value: number;
    label?: string;
}

interface WorldMapProps {
    data: CountryData[];
    title?: string;
    colorScale?: {
        min: string;
        max: string;
    };
    defaultColor?: string;
    height?: number | string;
    showLegend?: boolean;
    loading?: boolean;
}

// ISO 3166-1 alpha-2 to numeric ID mapping (used by world-atlas TopoJSON)
const alpha2ToNumeric: Record<string, string> = {
    AF: "004", AL: "008", DZ: "012", AS: "016", AD: "020", AO: "024", AI: "660",
    AG: "028", AR: "032", AM: "051", AW: "533", AU: "036", AT: "040", AZ: "031",
    BS: "044", BH: "048", BD: "050", BB: "052", BY: "112", BE: "056", BZ: "084",
    BJ: "204", BM: "060", BT: "064", BO: "068", BA: "070", BW: "072", BR: "076",
    BN: "096", BG: "100", BF: "854", BI: "108", KH: "116", CM: "120", CA: "124",
    CV: "132", CF: "140", TD: "148", CL: "152", CN: "156", CO: "170", KM: "174",
    CG: "178", CD: "180", CR: "188", CI: "384", HR: "191", CU: "192", CY: "196",
    CZ: "203", DK: "208", DJ: "262", DM: "212", DO: "214", EC: "218", EG: "818",
    SV: "222", GQ: "226", ER: "232", EE: "233", ET: "231", FJ: "242", FI: "246",
    FR: "250", GA: "266", GM: "270", GE: "268", DE: "276", GH: "288", GR: "300",
    GD: "308", GT: "320", GN: "324", GW: "624", GY: "328", HT: "332", HN: "340",
    HU: "348", IS: "352", IN: "356", ID: "360", IR: "364", IQ: "368", IE: "372",
    IL: "376", IT: "380", JM: "388", JP: "392", JO: "400", KZ: "398", KE: "404",
    KI: "296", KP: "408", KR: "410", KW: "414", KG: "417", LA: "418", LV: "428",
    LB: "422", LS: "426", LR: "430", LY: "434", LI: "438", LT: "440", LU: "442",
    MK: "807", MG: "450", MW: "454", MY: "458", MV: "462", ML: "466", MT: "470",
    MH: "584", MR: "478", MU: "480", MX: "484", FM: "583", MD: "498", MC: "492",
    MN: "496", ME: "499", MA: "504", MZ: "508", MM: "104", NA: "516", NR: "520",
    NP: "524", NL: "528", NZ: "554", NI: "558", NE: "562", NG: "566", NO: "578",
    OM: "512", PK: "586", PW: "585", PA: "591", PG: "598", PY: "600", PE: "604",
    PH: "608", PL: "616", PT: "620", QA: "634", RO: "642", RU: "643", RW: "646",
    KN: "659", LC: "662", VC: "670", WS: "882", SM: "674", ST: "678", SA: "682",
    SN: "686", RS: "688", SC: "690", SL: "694", SG: "702", SK: "703", SI: "705",
    SB: "090", SO: "706", ZA: "710", SS: "728", ES: "724", LK: "144", SD: "729",
    SR: "740", SZ: "748", SE: "752", CH: "756", SY: "760", TW: "158", TJ: "762",
    TZ: "834", TH: "764", TL: "626", TG: "768", TO: "776", TT: "780", TN: "788",
    TR: "792", TM: "795", TV: "798", UG: "800", UA: "804", AE: "784", GB: "826",
    US: "840", UY: "858", UZ: "860", VU: "548", VA: "336", VE: "862", VN: "704",
    YE: "887", ZM: "894", ZW: "716",
};

// Interpolate between two hex colors
function interpolateColor(color1: string, color2: string, factor: number): string {
    const hex = (c: string) => parseInt(c, 16);
    const r1 = hex(color1.slice(1, 3));
    const g1 = hex(color1.slice(3, 5));
    const b1 = hex(color1.slice(5, 7));
    const r2 = hex(color2.slice(1, 3));
    const g2 = hex(color2.slice(3, 5));
    const b2 = hex(color2.slice(5, 7));

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

const MapSkeleton = ({ height }: { height: number | string }) => (
    <Box
        bg="#111827"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        height={height}
        p={4}
    >
        <Skeleton height="100%" width="100%" bg="gray.800" />
    </Box>
);

export function WorldMap({
    data,
    title,
    colorScale = { min: "#1e3a5f", max: "#8b5cf6" },
    defaultColor = "#1e293b",
    height = 400,
    showLegend = true,
    loading = false,
}: WorldMapProps) {
    const [tooltipContent, setTooltipContent] = useState<{ name: string; value: number; label?: string } | null>(null);

    // Create a map of numeric IDs to values for quick lookup
    const dataByNumericId = useMemo(() => {
        const map: Record<string, CountryData> = {};
        data.forEach((item) => {
            const numericId = alpha2ToNumeric[item.countryCode.toUpperCase()];
            if (numericId) {
                map[numericId] = item;
            }
        });
        return map;
    }, [data]);

    // Calculate min and max values for color scaling
    const { minValue, maxValue } = useMemo(() => {
        if (data.length === 0) return { minValue: 0, maxValue: 0 };
        const values = data.map((d) => d.value);
        return {
            minValue: Math.min(...values),
            maxValue: Math.max(...values),
        };
    }, [data]);

    // Get color for a country based on its value
    const getCountryColor = (numericId: string) => {
        const countryData = dataByNumericId[numericId];
        if (!countryData) return defaultColor;

        if (maxValue === minValue) return colorScale.max;
        const factor = (countryData.value - minValue) / (maxValue - minValue);
        return interpolateColor(colorScale.min, colorScale.max, factor);
    };

    if (loading) {
        return <MapSkeleton height={height} />;
    }

    return (
        <Box
            bg="#111827"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            height={height}
            position="relative"
            overflow="hidden"
        >
            {title && (
                <Text
                    position="absolute"
                    top={4}
                    left={4}
                    color="gray.300"
                    fontSize="sm"
                    fontWeight="medium"
                    zIndex={10}
                >
                    {title}
                </Text>
            )}

            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 200,
                    center: [0, 50],
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <ZoomableGroup>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }: { geographies: Array<{ rsmKey: string; id: string; properties?: Record<string, string> }> }) =>
                            geographies.map((geo) => {
                                const numericId = geo.id;
                                const countryData = dataByNumericId[numericId];

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={getCountryColor(numericId)}
                                        stroke="#374151"
                                        strokeWidth={0.5}
                                        style={{
                                            default: {
                                                outline: "none",
                                                transition: "fill 0.2s",
                                            },
                                            hover: {
                                                fill: countryData ? "#a78bfa" : "#374151",
                                                outline: "none",
                                                cursor: countryData ? "pointer" : "default",
                                            },
                                            pressed: {
                                                outline: "none",
                                            },
                                        }}
                                        onMouseEnter={() => {
                                            if (countryData) {
                                                setTooltipContent({
                                                    name: geo.properties?.name || numericId,
                                                    value: countryData.value,
                                                    label: countryData.label,
                                                });
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            setTooltipContent(null);
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {/* Tooltip */}
            {tooltipContent && (
                <Box
                    position="absolute"
                    top={4}
                    right={4}
                    bg="gray.800"
                    borderRadius="md"
                    px={3}
                    py={2}
                    zIndex={10}
                    boxShadow="lg"
                >
                    <Text color="white" fontSize="sm" fontWeight="medium">
                        {tooltipContent.name}
                    </Text>
                    <Flex justify="flex-end" w="100%">
                        <Text color="purple.300" fontSize="lg" fontWeight="bold">
                            {tooltipContent.label || tooltipContent.value}
                        </Text>
                    </Flex>
                </Box>
            )}

            {/* Legend */}
            {showLegend && data.length > 0 && (
                <HStack
                    position="absolute"
                    bottom={4}
                    left={4}
                    gap={2}
                    zIndex={10}
                >
                    <Box
                        width="80px"
                        height="8px"
                        borderRadius="full"
                        bgGradient={`linear(to-r, ${colorScale.min}, ${colorScale.max})`}
                    />
                    <VStack gap={0} align="start">
                        <Text color="gray.400" fontSize="xs">
                            {minValue} - {maxValue}
                        </Text>
                    </VStack>
                </HStack>
            )}
        </Box>
    );
}

export default WorldMap;
