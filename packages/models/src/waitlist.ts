interface IWaitlistEntry {
    email: string;
    firstName: string;
    lastName: string;
    stripeAccounts: number;
    revenue: string;
    employees: string;
    country?: string;
    submittedAt: number;
    organisationId?: string;
}

export type { IWaitlistEntry };
