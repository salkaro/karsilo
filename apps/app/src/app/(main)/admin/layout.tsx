import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (session?.user?.isAdmin !== true) {
        redirect("/dashboard");
    }

    return <>{children}</>;
}
