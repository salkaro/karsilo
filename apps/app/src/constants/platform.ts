
import { LayoutGridIcon } from "@/icons/icons";
import { LucideIcon, UserRound, Wallet, Store, Table2, FilePlusCorner, UsersRound, ArrowLeftRight, UserLock, FileChartPie, Building2 } from "lucide-react";


export interface IItem {
    title: string;
    url: string;
    icon: LucideIcon;
    description: string;
    type: "page";
    items?: IItem[];
}

export const sidebarItems = {
    application: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: Table2,
            description: "Overview of your companies",
            type: "page" as const
        },
        {
            title: "Payments",
            url: "/payments",
            icon: ArrowLeftRight,
            description: "Overview of payments",
            type: "page" as const
        },
        {
            title: "Refunds",
            url: "/refunds",
            icon: FilePlusCorner,
            description: "Overview of refunds created by customers",
            type: "page" as const
        },
        {
            title: "Customers",
            url: "/customers",
            icon: UsersRound,
            description: "Overview of company customers",
            type: "page" as const
        },
    ] as IItem[],
    internal: [
        {
            title: "Reports",
            url: "/reports",
            icon: FileChartPie,
            description: "Generate reports",
            type: "page" as const
        },
        {
            title: "Employee Mangement",
            url: "/employee-management",
            icon: UserLock,
            description: "Overview of employees",
            type: "page" as const
        },
        {
            title: "Entities",
            url: "/entities",
            icon: Building2,
            description: "Overview of connected apps",
            type: "page" as const
        },
    ] as IItem[],
} as const satisfies Record<string, IItem[]>;


export const sidebarFooter = [] as IItem[];


export const settingsSubItems: IItem[] = [
    {
        title: "Overview",
        description: "Edit personal information",
        type: "page",
        url: "/settings#overview",
        icon: UserRound,
    },
    {
        title: "Organisation",
        description: "Edit organisational data & add members",
        type: "page",
        url: "/settings#organisation",
        icon: Store,
    },
    {
        title: "Billing",
        description: "View billing & manage memberships",
        type: "page",
        url: "/settings#billing",
        icon: Wallet,
    },
];