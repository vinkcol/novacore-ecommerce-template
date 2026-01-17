import React, { useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { THEME_STORAGE_KEY } from "../types/configuration.types";

interface ThemeColor {
    name: string;
    value: string; // HSL value, e.g., "354 76% 39%"
    class: string; // Tailwind class for preview
}

const PRESET_COLORS: ThemeColor[] = [
    { name: "Red", value: "354 76% 39%", class: "bg-red-600" },
    { name: "Blue", value: "221 83% 53%", class: "bg-blue-600" },
    { name: "Green", value: "142 76% 36%", class: "bg-green-600" },
    { name: "Orange", value: "24 95% 53%", class: "bg-orange-500" },
    { name: "Purple", value: "262 83% 58%", class: "bg-purple-600" },
    { name: "Black", value: "0 0% 0%", class: "bg-black" },
];

function applyThemePreview(hslValue: string) {
    const root = document.documentElement;
    root.style.setProperty("--primary", hslValue);
    root.style.setProperty("--ring", hslValue);
    root.style.setProperty("--secondary-foreground", hslValue);
}

interface ThemeSelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
    // Apply theme preview when value changes (including initial load)
    useEffect(() => {
        if (value) {
            applyThemePreview(value);
        }
    }, [value]);

    const handleColorSelect = (colorValue: string) => {
        applyThemePreview(colorValue);
        // Save to localStorage for instant persistence on reload
        try {
            const currentTheme = JSON.parse(
                localStorage.getItem(THEME_STORAGE_KEY) || "{}"
            );
            localStorage.setItem(
                THEME_STORAGE_KEY,
                JSON.stringify({
                    ...currentTheme,
                    primaryColor: colorValue,
                })
            );
        } catch {
            // Ignore localStorage errors
        }
        onChange(colorValue);
    };

    return (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
            {PRESET_COLORS.map((color) => {
                const isSelected = value === color.value;
                return (
                    <button
                        key={color.name}
                        type="button"
                        onClick={() => handleColorSelect(color.value)}
                        className={cn(
                            "group relative flex h-12 w-full cursor-pointer items-center justify-center rounded-xl transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2",
                            color.class,
                            isSelected ? "ring-2 ring-offset-2 ring-primary scale-105 shadow-md" : "opacity-80 hover:opacity-100"
                        )}
                        title={color.name}
                    >
                        {isSelected && (
                            <Check className="h-6 w-6 text-white drop-shadow-md" strokeWidth={3} />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
