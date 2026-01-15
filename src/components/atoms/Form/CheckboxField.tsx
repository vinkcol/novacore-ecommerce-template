"use client";

import React from "react";
import { useField } from "formik";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label: string | React.ReactNode;
    containerClassName?: string;
}

export function CheckboxField({
    label,
    containerClassName,
    ...props
}: CheckboxFieldProps) {
    const [field, meta] = useField({ ...props, type: "checkbox" });

    return (
        <div className={cn("space-y-1.5", containerClassName)}>
            <div className="flex items-start gap-2 pt-2">
                <input
                    {...field}
                    {...props}
                    type="checkbox"
                    id={props.id || props.name}
                    className={cn(
                        "mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary transition-all cursor-pointer",
                        meta.touched && meta.error && "border-destructive",
                        props.className
                    )}
                />
                <Label
                    htmlFor={props.id || props.name}
                    className="text-xs text-muted-foreground leading-tight cursor-pointer select-none"
                >
                    {label}
                </Label>
            </div>
            {meta.touched && meta.error && (
                <p className="text-[11px] font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
                    {meta.error}
                </p>
            )}
        </div>
    );
}
