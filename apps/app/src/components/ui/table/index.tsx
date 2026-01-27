"use client";

import { useState, useMemo, ReactNode } from "react";
import {
    Box,
    HStack,
    VStack,
    Text,
    Input,
    IconButton,
    Table,
    Portal,
    Select,
    createListCollection,
} from "@repo/ui";
import { LuRefreshCw, LuSearch, LuChevronLeft, LuChevronRight } from "react-icons/lu";

// Column definition
export interface Column<T> {
    key: string;
    header: string;
    align?: "left" | "center" | "right";
    render: (item: T, index: number, isLast: boolean) => ReactNode;
}

// Dropdown item for multi-value summary cards
export interface SummaryCardDropdownItem {
    label: string;
    value: string | number;
}

// Summary card definition
export interface SummaryCard {
    icon: ReactNode;
    iconColor: string;
    iconBg: string;
    label: string;
    value: string | number;
    dropdownItems?: SummaryCardDropdownItem[];
}

// Filter definition
export interface TableFilter {
    key: string;
    label: string;
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    searchPlaceholder?: string;
    searchFilter?: (item: T, query: string) => boolean;
    summaryCards?: SummaryCard[];
    filters?: TableFilter[];
    onRefresh?: () => void;
    loading?: boolean;
    emptyMessage?: string;
    getRowKey: (item: T) => string | number;
}

export function DataTable<T>({
    data,
    columns,
    itemsPerPage = 10,
    searchPlaceholder = "Search...",
    searchFilter,
    summaryCards,
    filters,
    onRefresh,
    loading,
    emptyMessage = "No data found",
    getRowKey,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data based on search query
    const filteredData = useMemo(() => {
        if (!searchQuery.trim() || !searchFilter) return data;
        const query = searchQuery.toLowerCase();
        return data.filter((item) => searchFilter(item, query));
    }, [data, searchQuery, searchFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    return (
        <VStack gap={4} align="stretch">
            {/* Search and Summary Row */}
            <HStack justify="space-between" wrap="wrap" gap={4}>
                {/* Search */}
                <HStack gap={2}>
                    <Box position="relative" width={{ base: "100%", md: "300px" }}>
                        <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400">
                            <LuSearch size={16} />
                        </Box>
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            pl={10}
                            size="sm"
                            borderRadius="md"
                        />
                    </Box>
                    {onRefresh && (
                        <IconButton
                            aria-label="Refresh"
                            size="sm"
                            variant="outline"
                            onClick={onRefresh}
                            loading={loading}
                            borderRadius="md"
                        >
                            <LuRefreshCw size={16} />
                        </IconButton>
                    )}
                    {/* Filters */}
                    {filters && filters.length > 0 && (
                        <>
                            {filters.map((filter) => {
                                const collection = createListCollection({
                                    items: filter.options,
                                });
                                return (
                                    <Select.Root
                                        key={filter.key}
                                        collection={collection}
                                        size="sm"
                                        width="150px"
                                        value={filter.value ? [filter.value] : []}
                                        onValueChange={(details) => filter.onChange(details.value[0] || "")}
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Trigger borderRadius="md">
                                            <Select.ValueText placeholder={filter.label} />
                                        </Select.Trigger>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {collection.items.map((item) => (
                                                        <Select.Item key={item.value} item={item}>
                                                            {item.label}
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                );
                            })}
                        </>
                    )}
                </HStack>

                {/* Summary Cards */}
                {summaryCards && summaryCards.length > 0 && (
                    <HStack gap={4} wrap="wrap">
                        {summaryCards.map((card, index) => (
                            <Box key={index} position="relative" className="group" w={{base: "full", md: "auto"}}>
                                <HStack
                                    pr={4}
                                    pl={2}
                                    py={2}
                                    borderRadius="md"
                                    border="1px solid"
                                    borderColor="gray.200"
                                    gap={3}
                                    justify="space-between"
                                    cursor={card.dropdownItems && card.dropdownItems.length > 1 ? "pointer" : "default"}
                                >
                                    <Box color={card.iconColor} bg={card.iconBg} padding={2} rounded="md">
                                        {card.icon}
                                    </Box>
                                    <VStack gap={0} align="end">
                                        <Text fontSize="xs" color="gray.500">
                                            {card.label}
                                        </Text>
                                        <Text fontSize="md" fontWeight="semibold">
                                            {card.value}
                                        </Text>
                                    </VStack>
                                </HStack>
                                {/* Dropdown on hover */}
                                {card.dropdownItems && card.dropdownItems.length > 1 && (
                                    <Box
                                        position="absolute"
                                        top="100%"
                                        right={0}
                                        mt={1}
                                        bg="white"
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor="gray.200"
                                        boxShadow="md"
                                        zIndex={10}
                                        minW="150px"
                                        opacity={0}
                                        visibility="hidden"
                                        transition="opacity 0.2s, visibility 0.2s"
                                        _groupHover={{ opacity: 1, visibility: "visible" }}
                                    >
                                        <VStack gap={0} align="stretch" py={1}>
                                            {card.dropdownItems.map((item, idx) => (
                                                <HStack
                                                    key={idx}
                                                    px={3}
                                                    py={2}
                                                    justify="space-between"
                                                    _hover={{ bg: "gray.50" }}
                                                >
                                                    <Text fontSize="sm" color="gray.600">
                                                        {item.label}
                                                    </Text>
                                                    <Text fontSize="sm" fontWeight="medium">
                                                        {item.value}
                                                    </Text>
                                                </HStack>
                                            ))}
                                        </VStack>
                                    </Box>
                                )}
                            </Box>
                        ))}
                    </HStack>
                )}
            </HStack>

            {/* Table */}
            <Box borderRadius="lg" border="1px solid" borderColor="gray.200" overflowX="auto">
                <Table.Root size="sm">
                    <Table.Header>
                        <Table.Row bg="gray.50">
                            {columns.map((column) => (
                                <Table.ColumnHeader
                                    key={column.key}
                                    border="none"
                                    textAlign={column.align || "left"}
                                >
                                    {column.header}
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {paginatedData.length === 0 ? (
                            <Table.Row>
                                <Table.Cell colSpan={columns.length} textAlign="center" py={8} color="gray.500">
                                    {emptyMessage}
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            paginatedData.map((item, index) => {
                                const isLast = index === paginatedData.length - 1;
                                return (
                                    <Table.Row key={getRowKey(item)}>
                                        {columns.map((column) => (
                                            <Table.Cell
                                                key={column.key}
                                                border={isLast ? "none" : ""}
                                                textAlign={column.align || "left"}
                                                minWidth={32}
                                            >
                                                {column.render(item, index, isLast)}
                                            </Table.Cell>
                                        ))}
                                    </Table.Row>
                                );
                            })
                        )}
                    </Table.Body>
                </Table.Root>
            </Box>

            {/* Pagination */}
            <HStack justify="space-between" align="center">
                <Text fontSize="sm" color="gray.500">
                    {filteredData.length > 0
                        ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredData.length)} of ${filteredData.length}`
                        : "0 of 0"}
                </Text>

                <HStack gap={2}>
                    <IconButton
                        aria-label="Previous page"
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <LuChevronLeft size={16} />
                    </IconButton>
                    <HStack
                        px={3}
                        py={1}
                        borderRadius="md"
                        bg="gray.100"
                        minW="80px"
                        justify="center"
                    >
                        <Text fontSize="sm">
                            {currentPage} of {totalPages || 1}
                        </Text>
                    </HStack>
                    <IconButton
                        aria-label="Next page"
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                    >
                        <LuChevronRight size={16} />
                    </IconButton>
                </HStack>
            </HStack>
        </VStack>
    );
}
