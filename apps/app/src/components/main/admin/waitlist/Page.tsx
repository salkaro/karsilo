"use client";

import { Column, DataTable, SummaryCard } from '@/components/ui/table';
import { useWaitlist } from '@/hooks/useWaitlist';
import { IWaitlistEntry } from '@repo/models';
import { formatDateByTimeAgo } from '@/utils/formatters';
import { Box, Text, VStack, Chart, useChart, Recharts } from '@repo/ui';
import { Users, CalendarPlus } from 'lucide-react';
import { useMemo } from 'react';
import { WorldMap, CountryData } from '@/components/ui/world-map';

const countryNameToCode: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "GB",
    "Canada": "CA",
    "Australia": "AU",
    "Germany": "DE",
    "France": "FR",
    "Netherlands": "NL",
    "Sweden": "SE",
    "Norway": "NO",
    "Denmark": "DK",
    "Finland": "FI",
    "Ireland": "IE",
    "Switzerland": "CH",
    "Austria": "AT",
    "Belgium": "BE",
    "Spain": "ES",
    "Italy": "IT",
    "Portugal": "PT",
    "Brazil": "BR",
    "Mexico": "MX",
    "India": "IN",
    "Japan": "JP",
    "South Korea": "KR",
    "Singapore": "SG",
    "New Zealand": "NZ",
    "South Africa": "ZA",
    "United Arab Emirates": "AE",
    "Israel": "IL",
    "Poland": "PL",
    "Czech Republic": "CZ",
};

const Page = () => {
    const { entries, refetch, loading } = useWaitlist();

    const columns: Column<IWaitlistEntry>[] = useMemo(() => [
        {
            key: "name",
            header: "Name",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" fontWeight="medium">
                    {entry.firstName} {entry.lastName}
                </Text>
            ),
        },
        {
            key: "email",
            header: "Email",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {entry.email}
                </Text>
            ),
        },
        {
            key: "country",
            header: "Country",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {entry.country ?? "Unknown"}
                </Text>
            ),
        },
        {
            key: "revenue",
            header: "Revenue",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {entry.revenue}
                </Text>
            ),
        },
        {
            key: "employees",
            header: "Employees",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {entry.employees}
                </Text>
            ),
        },
        {
            key: "stripeAccounts",
            header: "Stripe Accounts",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {entry.stripeAccounts}
                </Text>
            ),
        },
        {
            key: "date",
            header: "Signed Up",
            render: (entry: IWaitlistEntry) => (
                <Text fontSize="sm" color="gray.600">
                    {formatDateByTimeAgo(entry.submittedAt)}
                </Text>
            ),
        },
    ], []);

    async function onRefresh() {
        await refetch();
    }

    const searchFilter = (entry: IWaitlistEntry, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            entry.firstName.toLowerCase().includes(q) ||
            entry.lastName.toLowerCase().includes(q) ||
            entry.email.toLowerCase().includes(q) ||
            (entry.country?.toLowerCase().includes(q) ?? false)
        );
    };

    const summaryCards: SummaryCard[] = useMemo(() => {
        const total = entries?.length ?? 0;
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const thisWeek = entries?.filter((e) => e.submittedAt >= oneWeekAgo).length ?? 0;

        return [
            {
                icon: <Users size={20} />,
                iconColor: "purple.500",
                iconBg: "purple.500/10",
                label: "Total Signups",
                value: total,
            },
            {
                icon: <CalendarPlus size={20} />,
                iconColor: "green.500",
                iconBg: "green.500/10",
                label: "This Week",
                value: thisWeek,
            },
        ];
    }, [entries]);

    // Aggregate entries by country for the map
    const countryData: CountryData[] = useMemo(() => {
        if (!entries) return [];
        const countryCount: Record<string, number> = {};
        entries.forEach((entry) => {
            if (entry.country) {
                const code = countryNameToCode[entry.country] ?? entry.country.toUpperCase();
                countryCount[code] = (countryCount[code] || 0) + 1;
            }
        });
        return Object.entries(countryCount).map(([countryCode, value]) => ({
            countryCode,
            value,
            label: `${value}`,
        }));
    }, [entries]);

    // Aggregate signups by day for the chart
    const chartData = useMemo(() => {
        if (!entries || entries.length === 0) return [];

        const dayCount: Record<string, number> = {};
        entries.forEach((entry) => {
            const date = new Date(entry.submittedAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            dayCount[key] = (dayCount[key] || 0) + 1;
        });

        return Object.keys(dayCount)
            .sort()
            .map((key) => {
                const [year, month, day] = key.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                const label = date.toLocaleString("default", { month: "short", day: "numeric" });
                return { period: label, signups: dayCount[key] };
            });
    }, [entries]);

    const chart = useChart({
        data: chartData,
        series: [{ name: "signups" as never, color: "purple.500" }],
    });

    return (
        <VStack p={{ md: 6 }} gap={8} align="stretch">
            {countryData.length > 0 && (
                <Box>
                    <WorldMap
                        data={countryData}
                        height={350}
                        loading={loading}
                        showLegend
                    />
                </Box>
            )}

            {chartData.length > 0 && (
                <Box
                    bg="#0b0b1a"
                    p={6}
                    borderRadius="xl"
                    border="1px solid rgba(255, 255, 255, 0.2)"
                >
                    <Text fontSize="sm" fontWeight="semibold" color="gray.400" mb={4}>
                        Signups Over Time
                    </Text>
                    <Box height={{ base: "200px", xl: "300px" }}>
                        <Recharts.ResponsiveContainer width="100%" height="100%">
                            <Chart.Root chart={chart}>
                                <Recharts.AreaChart data={chart.data}>
                                    <defs>
                                        <linearGradient id="gradient-signups" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={chart.color("purple.500")} stopOpacity={0.3} />
                                            <stop offset="100%" stopColor={chart.color("purple.500")} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Recharts.CartesianGrid
                                        stroke="rgba(255, 255, 255, 0.2)"
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <Recharts.XAxis
                                        dataKey="period"
                                        tick={{ fill: chart.color("text.muted") }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Recharts.YAxis
                                        tick={{ fill: chart.color("text.muted") }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Recharts.Tooltip
                                        contentStyle={{
                                            backgroundColor: chart.color("bg.surface"),
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: "8px",
                                        }}
                                        labelStyle={{ color: chart.color("white") }}
                                    />
                                    <Recharts.Area
                                        type="monotone"
                                        dataKey={chart.key("signups" as never)}
                                        stroke={chart.color("purple.500")}
                                        fill="url(#gradient-signups)"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: chart.color("purple.500") }}
                                        activeDot={{ r: 6 }}
                                    />
                                </Recharts.AreaChart>
                            </Chart.Root>
                        </Recharts.ResponsiveContainer>
                    </Box>
                </Box>
            )}

            <DataTable
                data={entries ?? []}
                columns={columns}
                getRowKey={(entry: IWaitlistEntry) => entry.email}
                searchPlaceholder="Search by name, email, or country..."
                searchFilter={searchFilter}
                summaryCards={summaryCards}
                onRefresh={onRefresh}
                loading={loading}
                emptyMessage="No waitlist entries found"
            />
        </VStack>
    );
};

export default Page;
