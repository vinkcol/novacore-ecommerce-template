"use client";

import React from "react";
import { useField } from "formik";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { cn } from "@/lib/utils";

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    label?: string;
    containerClassName?: string;
}

export function TextAreaField({
    label,
    containerClassName,
    ...props
}: TextAreaFieldProps) {
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
            <textarea
                {...field}
                {...props}
                id={props.id || props.name}
                className={cn(
                    "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                    meta.touched && meta.error && "border-destructive focus-visible:ring-destructive",
                    props.className
                )}
            />
        </FormFieldWrapper>
    );
}
