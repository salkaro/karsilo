export type CustomerStatus = "active" | "deleted"

interface ICustomer {
    id: string;
    name?: string;
    email?: string;
    phone?: string;

    status?: CustomerStatus;
    currency?: string;
    country?: string | null;

    deleted?: boolean;
    
    imageUrl?: string;
    createdAt?: number;
}   


export type { ICustomer }