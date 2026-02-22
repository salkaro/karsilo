"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Text, HStack, Button } from "@repo/ui";
import { IConsolidateReport } from "@repo/models";
import { ExportOptions } from "@/types/export";
import { generateCSV, generateQuickBooksIIF } from "@/utils/export-helpers";
import { Check, Copy } from "lucide-react";

interface ExportPreviewProps {
    report: IConsolidateReport;
    format: 'csv' | 'iif';
    options: ExportOptions;
}

export default function ExportPreview({ report, format, options }: ExportPreviewProps) {
    const [copied, setCopied] = useState(false);

    const previewContent = useMemo(() => {
        let content: string;
        if (format === 'csv') {
            content = generateCSV(report, options.csv);
        } else {
            content = generateQuickBooksIIF(report, options.iif);
        }
        // Limit preview to first 15 lines
        const lines = content.split('\n');
        const preview = lines.slice(0, 15).join('\n');
        return {
            preview,
            totalLines: lines.length,
            full: content,
        };
    }, [report, format, options]);

    useEffect(() => {
        if (!copied) return;

        const timeout = setTimeout(() => {
            setCopied(false);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [copied]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(previewContent.full);
            setCopied(true);
        } catch {
            // optional: show toast if you want
        }
    };

    return (
        <Box>
            <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Preview ({previewContent.totalLines} lines total)
                </Text>
                <Button size="xs" variant="ghost" onClick={handleCopy}>
                    {copied ? (
                        <Check
                            size={14}
                            className="transition-all duration-200 scale-110 text-green-500"
                        />
                    ) : (
                        <Copy size={14} />
                    )}
                    {copied ? "Copied" : "Copy"}
                </Button>
            </HStack>
            <Box
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={3}
                maxH="250px"
                overflowY="auto"
                fontFamily="mono"
                fontSize="xs"
                whiteSpace="pre"
                overflowX="auto"
            >
                {previewContent.preview}
                {previewContent.totalLines > 15 && (
                    <Text color="gray.400" mt={1}>
                        ... {previewContent.totalLines - 15} more lines
                    </Text>
                )}
            </Box>
        </Box>
    );
}
