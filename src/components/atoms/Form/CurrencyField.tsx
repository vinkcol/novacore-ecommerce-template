"use client";

import React from "react";
import { useField, useFormikContext } from "formik";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencyFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    name: string;
    label?: string;
    icon?: LucideIcon;
    containerClassName?: string;
}

export function CurrencyField({
    label,
    icon: Icon,
    containerClassName,
    ...props
}: CurrencyFieldProps) {
    const [field, meta] = useField(props.name);
    const { setFieldValue } = useFormikContext();

    // Formatter for COP (or similar decimal/thousand structure)
    // 2000000 -> 2.000.000
    const formatCurrency = (value: string | number) => {
        if (value === undefined || value === null || value === "") return "";
        const numericValue = typeof value === "string" ? value.replace(/\D/g, "") : value.toString();
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Parser: 2.000.000 -> 2000000
    const parseCurrency = (value: string) => {
        return value.replace(/\./g, "");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseCurrency(rawValue).replace(/\D/g, "");
        setFieldValue(props.name, numericValue === "" ? "" : Number(numericValue));
    };

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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground/60 z-10">
                    $
                </div>
                <Input
                    {...field}
                    {...props}
                    type="text"
                    value={formatCurrency(field.value)}
                    onChange={handleChange}
                    id={props.id || props.name}
                    className={cn(
                        "h-12 rounded-xl focus-visible:ring-primary pl-8",
                        Icon && "pl-10",
                        meta.touched && meta.error && "border-destructive focus-visible:ring-destructive",
                        props.className
                    )}
                />
            </div>
        </FormFieldWrapper>
    );
}
