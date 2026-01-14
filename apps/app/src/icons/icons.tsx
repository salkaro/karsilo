import { LayoutGrid, LucideProps } from "lucide-react"
import { FaStripeS } from "react-icons/fa"
import { forwardRef } from "react"
import { extractInitials } from "@/utils/extract"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui"


export const ProfileImage = ({ className, image, name, email }: { className?: string, image?: string, name?: string, email?: string }) => {
    return (
        <Avatar.Root className={`h-8 w-8 ${className} ${image ? "bg-input" : "border"} rounded-full flex items-center justify-center`}>
            <AvatarImage src={image} alt="PI" className='rounded-md' />
            <AvatarFallback className="text-primary text-sm font-bold bg-background!">
                {extractInitials({ name: name, email: email })}
            </AvatarFallback>
        </Avatar.Root>
    )
}

export const LayoutGridIcon = forwardRef<SVGSVGElement, LucideProps>(
    (props, ref) => (
        <LayoutGrid
            ref={ref}
            {...props}
            className={`rotate-45 ${props.className ?? ""}`}
        />
    )
)

LayoutGridIcon.displayName = "LayoutGridIcon"
export const stripeBrandColorHex = "#635bff"
export const StripeIcon = ({ className, size }: { className?: string, size?: number }) => {
    return (
        <Avatar.Root
            className={`${className} rounded-lg flex items-center justify-center`}
            style={{
                background: stripeBrandColorHex,
                width: size ? size : 32,
                height: size ? size : 32,
            }}
        >
            <FaStripeS className="text-white" size={size ? size / 2 : 16} />
        </Avatar.Root>
    )
}
