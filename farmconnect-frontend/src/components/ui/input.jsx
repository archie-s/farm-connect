import React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef(({ className, ...props }, ref) => (
	<input
		ref={ref}
		className={cn(
			"h-11 w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 transition placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
			className
		)}
		{...props}
	/>
));

Input.displayName = "Input";
