"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useField, useFormikContext } from "formik";
import { FormFieldWrapper } from "./FormFieldWrapper";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, Check } from "lucide-react";

interface SelectFieldOption {
    label: string;
    value: string;
}

interface SelectFieldProps {
    name: string;
    label?: string;
    options: SelectFieldOption[];
    containerClassName?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    id?: string;
    className?: string; // Add className prop
}

export function SelectField({
    label,
    options,
    containerClassName,
    placeholder = "Seleccionar...",
    required,
    disabled,
    ...props
}: SelectFieldProps) {
    const [field, meta] = useField(props.name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filter options based on search query
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const normalizedQuery = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return options.filter(option =>
            option.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .includes(normalizedQuery)
        );
    }, [options, searchQuery]);

    // Get current selected label
    const selectedOption = options.find(opt => opt.value === field.value);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFieldTouched(field.name, true);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, field.name, setFieldTouched]);

    // Focus search input when opened
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            // Small timeout to allow render
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        } else {
            // Reset search when closed
            setSearchQuery("");
        }
    }, [isOpen]);

    const handleSelect = (value: string) => {
        setFieldValue(field.name, value);
        setIsOpen(false);
        setSearchQuery("");
    };

    const toggleOpen = () => {
        if (disabled) return;
        setIsOpen(!isOpen);
    };

    return (
        <FormFieldWrapper
            id={props.id || props.name}
            label={label}
            error={meta.error}
            touched={meta.touched}
            required={required}
            className={containerClassName}
        >
            <div
                ref={containerRef}
                className={cn("relative group", disabled && "opacity-50 pointer-events-none")}
            >
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={toggleOpen}
                    className={cn(
                        "flex h-12 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        meta.touched && meta.error && "border-destructive focus:ring-destructive",
                        isOpen && "ring-2 ring-primary ring-offset-2 border-primary",
                        !field.value && "text-muted-foreground",
                        props.className
                    )}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full min-w-[200px] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 slide-in-from-top-2">
                        {/* Search Input */}
                        <div className="flex items-center border-b px-3 pb-2 pt-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                                ref={searchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar..."
                                className={cn(
                                    "flex h-8 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                )}
                            />
                        </div>

                        {/* Options List */}
                        <div className="max-h-[240px] overflow-auto p-1 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                            {filteredOptions.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                    No se encontraron resultados.
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-lg px-2 py-2.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                                            field.value === option.value && "bg-accent text-accent-foreground font-medium"
                                        )}
                                    >
                                        <div className="flex h-4 w-4 items-center justify-center mr-2">
                                            {field.value === option.value && (
                                                <Check className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        {option.label}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </FormFieldWrapper>
    );
}
