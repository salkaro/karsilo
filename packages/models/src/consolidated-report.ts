export interface IConsolidateReport {
    id: string;
    paymentsBreakdown: IPaymentsBreakdown;
    customerBreakdown: ICustomerBreakdown;
    refundsBreakdown: IRefundsBreakdown;
    productsBreakdown: IProductsBreakdown;
    createdAt: number;
    from: number;
    to: number;
    status: "completed" | "failed";
}

export interface IPaymentsBreakdown {
    recurring: { country: string, currency: string, amount: number, fees: number; entityId: string, entityName: string }[];
    oneTime: { country: string, currency: string, amount: number, fees: number; entityId: string, entityName: string }[];
}

export interface ICustomerBreakdown {
    total: { country: string, count: number, active: number, deleted: number, entityId: string, entityName: string }[];
    new: { country: string, count: number, entityId: string, entityName: string }[];
}

export interface IRefundsBreakdown {
    gained: { country: string, currency: string, count: number, amount: number, entityId: string, entityName: string }[];
}

export interface IProductsBreakdown {
    gained: { productId: string, productName: string; country: string, currency: string, revenue: number, customers: number, entityId: string, entityName: string }[]
}
