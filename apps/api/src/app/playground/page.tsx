"use client";

import { useState } from "react";

const endpoints = [
    { method: "GET" as const, path: "/health", params: [] },
    { method: "GET" as const, path: "/v1/accounts", params: [] },
    {
        method: "GET" as const,
        path: "/v1/customers",
        params: ["accountId", "starting_after"],
    },
    {
        method: "GET" as const,
        path: "/v1/payments",
        params: ["accountId", "starting_after"],
    },
    {
        method: "GET" as const,
        path: "/v1/products",
        params: ["accountId", "starting_after"],
    },
    {
        method: "GET" as const,
        path: "/v1/subscriptions",
        params: ["accountId", "starting_after"],
    },
    {
        method: "GET" as const,
        path: "/v1/invoices",
        params: ["accountId", "starting_after"],
    },
    {
        method: "GET" as const,
        path: "/v1/revenue",
        params: ["accountId", "starting_after", "from", "to"],
    },
    {
        method: "GET" as const,
        path: "/v1/refunds",
        params: ["accountId", "starting_after", "from", "to"],
    },
    {
        method: "GET" as const,
        path: "/v1/reports",
        params: ["accountId", "starting_after"],
    },
];

type EndpointState = {
    params: Record<string, string>;
    status: number | null;
    response: unknown | null;
    loading: boolean;
    expanded: boolean;
};

function buildInitialState(): Record<string, EndpointState> {
    const state: Record<string, EndpointState> = {};
    for (const ep of endpoints) {
        const params: Record<string, string> = {};
        for (const p of ep.params) {
            params[p] = "";
        }
        state[ep.path] = {
            params,
            status: null,
            response: null,
            loading: false,
            expanded: false,
        };
    }
    return state;
}

export default function PlaygroundPage() {
    const [apiKey, setApiKey] = useState("");
    const [orgId, setOrgId] = useState("");
    const [epState, setEpState] = useState<Record<string, EndpointState>>(
        buildInitialState
    );

    const updateEp = (path: string, patch: Partial<EndpointState>) => {
        setEpState((prev) => ({
            ...prev,
            [path]: { ...prev[path], ...patch },
        }));
    };

    const updateParam = (path: string, param: string, value: string) => {
        setEpState((prev) => ({
            ...prev,
            [path]: {
                ...prev[path],
                params: { ...prev[path].params, [param]: value },
            },
        }));
    };

    const sendRequest = async (path: string) => {
        const ep = epState[path];
        const query = Object.entries(ep.params)
            .filter(([, v]) => v !== "")
            .map(
                ([k, v]) =>
                    `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
            )
            .join("&");
        const url = query ? `${path}?${query}` : path;

        updateEp(path, { loading: true, status: null, response: null });

        try {
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "X-Org-Id": orgId,
                },
            });
            let body: unknown;
            try {
                body = await res.json();
            } catch {
                body = null;
            }
            updateEp(path, { status: res.status, response: body, loading: false });
        } catch (err) {
            updateEp(path, {
                status: null,
                response: { error: err instanceof Error ? err.message : "Network error" },
                loading: false,
            });
        }
    };

    const statusColor = (status: number | null) => {
        if (status === null) return "#6b7280";
        if (status >= 200 && status < 300) return "#059669";
        return "#dc2626";
    };

    const statusBg = (status: number | null) => {
        if (status === null) return "#f3f4f6";
        if (status >= 200 && status < 300) return "#ecfdf5";
        return "#fef2f2";
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#fafafa",
                fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: "#111827",
            }}
        >
            <div
                style={{
                    maxWidth: 720,
                    margin: "0 auto",
                    padding: "40px 24px 80px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 32,
                    }}
                >
                    <a
                        href="/"
                        style={{
                            fontSize: 13,
                            color: "#6b7280",
                            textDecoration: "none",
                        }}
                    >
                        &larr; Back to API Home
                    </a>
                    <h1
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            margin: 0,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        API Playground
                    </h1>
                    <div style={{ width: 120 }} />
                </div>

                {/* API Key Input */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 24,
                    }}
                >
                    <label
                        style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 8,
                        }}
                    >
                        API Key
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key"
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: 14,
                            fontFamily: "monospace",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {/* Org ID Input */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: "16px 20px",
                        marginBottom: 24,
                    }}
                >
                    <label
                        style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 8,
                        }}
                    >
                        Organisation ID
                    </label>
                    <input
                        type="text"
                        value={orgId}
                        onChange={(e) => setOrgId(e.target.value)}
                        placeholder="Enter your organisation ID"
                        style={{
                            width: "100%",
                            padding: "10px 14px",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            fontSize: 14,
                            fontFamily: "monospace",
                            outline: "none",
                            boxSizing: "border-box",
                        }}
                    />
                </div>

                {/* Endpoint Cards */}
                {endpoints.map((ep) => {
                    const state = epState[ep.path];
                    return (
                        <div
                            key={ep.path}
                            style={{
                                background: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: 12,
                                marginBottom: 12,
                                overflow: "hidden",
                            }}
                        >
                            {/* Card Header */}
                            <div
                                onClick={() =>
                                    updateEp(ep.path, {
                                        expanded: !state.expanded,
                                    })
                                }
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "14px 20px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: "#059669",
                                        background: "#ecfdf5",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        fontFamily: "monospace",
                                    }}
                                >
                                    {ep.method}
                                </span>
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontFamily: "monospace",
                                        color: "#374151",
                                        flex: 1,
                                    }}
                                >
                                    {ep.path}
                                </span>
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: "#9ca3af",
                                        transition: "transform 0.2s",
                                        transform: state.expanded
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                >
                                    &#9660;
                                </span>
                            </div>

                            {/* Expanded Content */}
                            {state.expanded && (
                                <div
                                    style={{
                                        padding: "0 20px 16px",
                                        borderTop: "1px solid #f3f4f6",
                                    }}
                                >
                                    {/* Param Inputs */}
                                    {ep.params.length > 0 && (
                                        <div
                                            style={{
                                                paddingTop: 16,
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 10,
                                            }}
                                        >
                                            {ep.params.map((param) => (
                                                <div
                                                    key={param}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 12,
                                                    }}
                                                >
                                                    <label
                                                        style={{
                                                            fontSize: 13,
                                                            fontFamily:
                                                                "monospace",
                                                            color: "#6b7280",
                                                            minWidth: 120,
                                                        }}
                                                    >
                                                        {param}
                                                    </label>
                                                    <input
                                                        type={
                                                            param === "from" ||
                                                            param === "to"
                                                                ? "number"
                                                                : "text"
                                                        }
                                                        value={
                                                            state.params[
                                                                param
                                                            ] || ""
                                                        }
                                                        onChange={(e) =>
                                                            updateParam(
                                                                ep.path,
                                                                param,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder={
                                                            param === "from" ||
                                                            param === "to"
                                                                ? "Unix timestamp"
                                                                : ""
                                                        }
                                                        style={{
                                                            flex: 1,
                                                            padding: "8px 12px",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: 6,
                                                            fontSize: 13,
                                                            fontFamily:
                                                                "monospace",
                                                            outline: "none",
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Send Button */}
                                    <div
                                        style={{
                                            paddingTop: 16,
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <button
                                            onClick={() =>
                                                sendRequest(ep.path)
                                            }
                                            disabled={state.loading}
                                            style={{
                                                padding: "8px 20px",
                                                background: state.loading
                                                    ? "#6b7280"
                                                    : "#111827",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 8,
                                                fontSize: 13,
                                                fontWeight: 600,
                                                cursor: state.loading
                                                    ? "not-allowed"
                                                    : "pointer",
                                            }}
                                        >
                                            {state.loading
                                                ? "Sending\u2026"
                                                : "Send Request"}
                                        </button>
                                    </div>

                                    {/* Response */}
                                    {(state.status !== null ||
                                        state.response !== null) && (
                                        <div style={{ paddingTop: 16 }}>
                                            {state.status !== null && (
                                                <span
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: statusColor(
                                                            state.status
                                                        ),
                                                        background: statusBg(
                                                            state.status
                                                        ),
                                                        padding: "2px 10px",
                                                        borderRadius: 6,
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    {state.status}
                                                </span>
                                            )}
                                            <pre
                                                style={{
                                                    background: "#f9fafb",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: 8,
                                                    padding: 16,
                                                    fontSize: 12,
                                                    fontFamily: "monospace",
                                                    overflow: "auto",
                                                    maxHeight: 400,
                                                    margin: 0,
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {JSON.stringify(
                                                    state.response,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                <p
                    style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginTop: 32,
                        textAlign: "center",
                    }}
                >
                    &copy; {new Date().getFullYear()} Karsilo
                </p>
            </div>
        </div>
    );
}
