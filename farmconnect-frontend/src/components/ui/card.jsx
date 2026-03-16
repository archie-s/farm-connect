import { cn } from "@/lib/utils";

export const Card = (p) => <div className={cn("rounded-2xl border border-gray-200 bg-white shadow-sm", p.className)}>{p.children}</div>
export const CardHeader = (p) => <div className={cn("space-y-1.5 p-5 sm:p-6", p.className)}>{p.children}</div>
export const CardTitle = (p) => <h3 className={cn("text-lg font-semibold tracking-tight text-gray-900", p.className)}>{p.children}</h3>
export const CardContent = (p) => <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", p.className)}>{p.children}</div>
export const CardDescription = (p) => <p className={cn("text-sm leading-relaxed text-gray-500", p.className)}>{p.children}</p>
