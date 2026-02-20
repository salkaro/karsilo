const endpoints = [
    { method: "GET", path: "/v1/accounts" },
    { method: "GET", path: "/v1/customers" },
    { method: "GET", path: "/v1/payments" },
    { method: "GET", path: "/v1/products" },
    { method: "GET", path: "/v1/subscriptions" },
    { method: "GET", path: "/v1/invoices" },
    { method: "GET", path: "/v1/revenue" },
    { method: "GET", path: "/v1/refunds" },
    { method: "GET", path: "/v1/reports" },
    { method: "GET", path: "/health" },
];

export default function Home() {
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
                    maxWidth: 640,
                    margin: "0 auto",
                    padding: "80px 24px",
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        padding: "4px 12px",
                        background: "#f3f4f6",
                        borderRadius: 9999,
                        marginBottom: 16,
                    }}
                >
                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                        }}
                    >
                        v1
                    </span>
                </div>

                <h1
                    style={{
                        fontSize: 40,
                        fontWeight: 700,
                        margin: "0 0 12px",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                    }}
                >
                    Karsilo API
                </h1>

                <p
                    style={{
                        fontSize: 18,
                        color: "#6b7280",
                        margin: "0 0 40px",
                        lineHeight: 1.6,
                    }}
                >
                    Unified access to your Stripe data across all connected
                    accounts.
                </p>

                <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
                    <a
                        href="https://karsilo.com/docs/api"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "12px 24px",
                            background: "#111827",
                            color: "#fff",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            transition: "background 0.2s",
                        }}
                    >
                        API Documentation &rarr;
                    </a>
                    <a
                        href="/health"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "12px 24px",
                            background: "#fff",
                            color: "#111827",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        Health Check
                    </a>
                    <a
                        href="/playground"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "12px 24px",
                            background: "#fff",
                            color: "#111827",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 600,
                            textDecoration: "none",
                            border: "1px solid #e5e7eb",
                        }}
                    >
                        Playground
                    </a>
                </div>

                <div
                    style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1px solid #e5e7eb",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            padding: "16px 20px",
                            borderBottom: "1px solid #f3f4f6",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#6b7280",
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Endpoints
                        </span>
                    </div>
                    {endpoints.map((endpoint, i) => (
                        <div
                            key={endpoint.path}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 20px",
                                borderBottom:
                                    i < endpoints.length - 1
                                        ? "1px solid #f3f4f6"
                                        : "none",
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
                                {endpoint.method}
                            </span>
                            <span
                                style={{
                                    fontSize: 14,
                                    fontFamily: "monospace",
                                    color: "#374151",
                                }}
                            >
                                {endpoint.path}
                            </span>
                        </div>
                    ))}
                </div>

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
