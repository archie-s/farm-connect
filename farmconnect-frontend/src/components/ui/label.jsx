import { cn } from "@/lib/utils";

export const Label = ({ className, ...props }) => <label className={cn("mb-1.5 block text-sm font-medium text-gray-700", className)} {...props} />
