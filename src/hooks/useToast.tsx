import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle, Info, Loader2, Bell } from "lucide-react";
import React from 'react';

interface ToastOptions {
    description?: string;
    duration?: number;
}

export const useToast = () => {
    const success = (message: string, options?: ToastOptions) => {
        return sonnerToast.success(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        });
    };

    const error = (message: string, options?: ToastOptions) => {
        return sonnerToast.error(message, {
            description: options?.description,
            duration: options?.duration || 5000,
            icon: <AlertCircle className="h-5 w-5 text-red-500" />,
        });
    };

    const info = (message: string, options?: ToastOptions) => {
        return sonnerToast.info(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: <Info className="h-5 w-5 text-blue-500" />,
        });
    };

    const warning = (message: string, options?: ToastOptions) => {
        return sonnerToast.warning(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
        });
    };

    const loading = (message: string, options?: ToastOptions) => {
        return sonnerToast.loading(message, {
            description: options?.description,
            icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
        });
    };

    const vink = (message: string, options?: ToastOptions) => {
        return sonnerToast(message, {
            description: options?.description,
            duration: options?.duration || 4000,
            icon: <Bell className="h-5 w-5 text-primary" />,
            style: {
                background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
                border: '1px solid rgba(var(--primary), 0.2)',
            }
        });
    };

    const promise = (
        promise: Promise<unknown>,
        messages: {
            loading: string;
            success: string | ((data: unknown) => string);
            error: string | ((error: unknown) => string);
        }
    ) => {
        return sonnerToast.promise(promise, {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        });
    };

    const dismiss = (id?: string | number) => {
        return sonnerToast.dismiss(id);
    };

    return {
        success,
        error,
        info,
        warning,
        loading,
        vink,
        promise,
        dismiss,
        custom: sonnerToast,
    };
};
