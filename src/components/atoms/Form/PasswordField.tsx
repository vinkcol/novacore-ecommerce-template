"use client";

import React, { useState } from "react";
import { useField } from "formik";
import { Input } from "@/components/ui/input";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    icon?: LucideIcon;
    containerClassName?: string;
}

export function PasswordField({
    label,
    icon: Icon,
    containerClassName,
    ...props
}: PasswordFieldProps) {
    const [field, meta] = useField(props.name);
    const [showPassword, setShowPassword] = useState(false);

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
                    type={showPassword ? "text" : "password"}
                    id={props.id || props.name}
                    className={cn(
                        "h-12 rounded-xl focus-visible:ring-primary pr-12",
                        Icon && "pl-10",
                        meta.touched && meta.error && "border-destructive focus-visible:ring-destructive",
                        props.className
                    )}
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 hover:bg-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                    ) : (
                        <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    </span>
                </Button>
            </div>
        </FormFieldWrapper>
    );
}
