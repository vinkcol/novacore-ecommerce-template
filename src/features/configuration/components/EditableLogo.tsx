import React, { useRef, useState } from "react";
import { Upload, ImageIcon, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EditableLogoProps {
    currentLogoUrl: string | null;
    isEditing: boolean;
    onLogoChange: (file: File) => void;
    onDelete: () => void;
    storeName: string;
}

export const EditableLogo = ({
    currentLogoUrl,
    isEditing,
    onLogoChange,
    onDelete,
    storeName
}: EditableLogoProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Get initial from store name (default to 'F' if empty)
    const initial = (storeName || "Foodie").charAt(0).toUpperCase();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isEditing) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (!isEditing) return;

        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.match(/^image\/(png|jpeg|webp)$/) || file.type === "image/svg+xml")) {
            onLogoChange(file);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onLogoChange(file);
        }
    };

    const handleClick = () => {
        if (isEditing) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className="flex flex-col gap-2 relative group-logo">
            {/* Main Logo Container */}
            <div
                className={cn(
                    "w-32 h-32 rounded-2xl border-2 flex flex-col items-center justify-center overflow-hidden relative transition-all",
                    currentLogoUrl ? "bg-muted/30" : "bg-muted/10",
                    isEditing
                        ? "border-dashed border-muted-foreground/25 cursor-pointer hover:border-primary/50 hover:bg-primary/5"
                        : "border-transparent",
                    isDragging && "border-primary bg-primary/10 scale-105"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {currentLogoUrl ? (
                    <img
                        src={currentLogoUrl}
                        alt="Logo Preview"
                        className={cn(
                            "w-full h-full object-contain p-2",
                            isEditing && "group-hover:opacity-40 transition-opacity"
                        )}
                    />
                ) : (
                    <div className={cn(
                        "flex flex-col items-center gap-3 p-4 text-center",
                        isEditing && "group-hover:opacity-40 transition-opacity"
                    )}>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-2xl font-bold text-primary">{initial}</span>
                        </div>
                        <span className="text-sm font-semibold leading-tight line-clamp-2 px-1 text-muted-foreground">
                            {storeName || "Tu Tienda"}
                        </span>
                    </div>
                )}

                {/* Edit Overlay / Upload Hint */}
                {isEditing && (
                    <div className={cn(
                        "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity pointer-events-none",
                        currentLogoUrl || !isEditing ? "opacity-0 group-hover:opacity-100 bg-background/60 backdrop-blur-[1px]" : ""
                    )}>
                        <div className="p-2 bg-background rounded-full shadow-sm">
                            {currentLogoUrl ? <ImageIcon className="text-primary" size={20} /> : <Upload className="text-primary" size={20} />}
                        </div>
                        <span className="text-xs font-medium text-foreground bg-background/80 px-2 py-1 rounded-full shadow-sm border">
                            {currentLogoUrl ? "Cambiar Logo" : "Subir Logo"}
                        </span>
                    </div>
                )}
            </div>

            {/* Hidden Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileSelect}
                disabled={!isEditing}
            />

            {/* Delete Button - Only in Edit Mode and if logo exists */}
            {isEditing && currentLogoUrl && (
                <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover-logo:opacity-100 transition-opacity">
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 rounded-full shadow-md hover:scale-105 transition-transform"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <X size={12} />
                    </Button>
                </div>
            )}

            {/* Text Delete Button */}
            {isEditing && currentLogoUrl && (
                <button
                    type="button"
                    onClick={() => onDelete()}
                    className="text-[10px] text-destructive hover:underline flex items-center justify-center gap-1 mt-1 mx-auto font-medium"
                >
                    <Trash2 size={10} />
                    Eliminar
                </button>
            )}
        </div>
    );
};
