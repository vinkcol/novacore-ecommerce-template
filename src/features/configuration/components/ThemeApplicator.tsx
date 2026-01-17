"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectConfiguration, selectConfigurationLoading } from "../redux/configurationSelectors";
import { fetchConfigurationStart } from "../redux/configurationSlice";
import { CommerceConfig, DEFAULT_THEME_CONFIG, THEME_STORAGE_KEY } from "../types/configuration.types";

declare global {
    interface Window {
        __THEME_APPLIED__?: boolean;
    }
}

interface ThemeApplicatorProps {
    children: ReactNode;
}

function saveThemeToStorage(theme: CommerceConfig["theme"]) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch {
        // Ignore localStorage errors
    }
}

function applyThemeToDOM(theme: CommerceConfig["theme"]) {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primaryColor);
    root.style.setProperty("--primary-foreground", theme.primaryForeground);
    root.style.setProperty("--ring", theme.primaryColor);
    root.style.setProperty("--secondary-foreground", theme.primaryColor);
    root.style.setProperty("--radius", theme.radius);
}

export function ThemeApplicator({ children }: ThemeApplicatorProps) {
    const dispatch = useDispatch();
    const config = useSelector(selectConfiguration);
    const loading = useSelector(selectConfigurationLoading);
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        // Fetch configuration on mount (only once)
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            dispatch(fetchConfigurationStart());
        }
    }, [dispatch]);

    useEffect(() => {
        // Wait until loading is complete AND we have real config from Firestore
        // (config starts as null, so this prevents applying defaults)
        if (loading || !config) return;

        const theme = config.theme || DEFAULT_THEME_CONFIG;

        // Apply theme to DOM
        applyThemeToDOM(theme);

        // Save theme to localStorage for next page load
        saveThemeToStorage(theme);
    }, [config, loading]);

    // No spinner needed - theme is applied instantly from localStorage via inline script
    return <>{children}</>;
}
