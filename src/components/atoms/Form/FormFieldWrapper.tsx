"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldWrapperProps {
    label?: string;
    error?: string;
    touched?: boolean;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
    id?: string;
    description?: string;
}

export function FormFieldWrapper({
    label,
    error,
    touched,
    required,
    children,
    className,
    id,
    description
}: FormFieldWrapperProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            {label && (
                <Label
                    htmlFor={id}
                    className="text-xs font-bold uppercase ml-1"
                >
                    {label} {required && <span className="text-red-500">*</span>}
                </Label>
            )}
            <div className="relative">
                {children}
            </div>
            {description && (
                <p className="text-[11px] text-muted-foreground ml-1">
                    {description}
                </p>
            )}
            {touched && error && (
                <p className="text-[11px] font-medium text-destructive ml-1 animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}
