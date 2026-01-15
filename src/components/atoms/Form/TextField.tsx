"use client";

import React from "react";
import { useField } from "formik";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    icon?: LucideIcon;
    containerClassName?: string;
}

export function TextField({
    label,
    icon: Icon,
    containerClassName,
    ...props
}: TextFieldProps) {
    const [field, meta] = useField(props.name);

    return (
        <FormFieldWrapper
            id={props.id || props.name}
            label={label}
            error={meta.error}
            touched={meta.touched}
            required={props.required}
            className={containerClassName}
        >
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                )}
                <Input
                    {...field}
                    {...props}
                    id={props.id || props.name}
                    className={cn(
                        "h-12 rounded-xl focus-visible:ring-primary",
                        Icon && "pl-10",
                        meta.touched && meta.error && "border-destructive focus-visible:ring-destructive",
                        props.className
                    )}
                />
            </div>
        </FormFieldWrapper>
    );
}
