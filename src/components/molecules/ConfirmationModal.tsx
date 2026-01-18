"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    isLoading?: boolean;
}

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    variant = "default",
    isLoading = false
}: ConfirmationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md rounded-3xl p-6">
                <div className="flex flex-col items-center text-center gap-4 py-4">
                    <div className={`p-4 rounded-full bg-${variant === 'destructive' ? 'destructive/10' : 'primary/10'} text-${variant === 'destructive' ? 'destructive' : 'primary'}`}>
                        <AlertTriangle size={32} />
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">{title}</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 mt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="rounded-xl flex-1 border-0 bg-secondary/50 hover:bg-secondary"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        className="rounded-xl flex-1"
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
