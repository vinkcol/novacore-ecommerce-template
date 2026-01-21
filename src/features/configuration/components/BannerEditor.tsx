import React, { useRef, useState, useEffect } from "react";
import { Upload, ImageIcon, X, Save, Loader2, Image as LucideImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { selectConfiguration, selectConfigurationUpdating } from "@/features/configuration/redux/configurationSelectors";
import { updateConfigurationStart } from "@/features/configuration/redux/configurationSlice";
import { uploadImage } from "@/lib/firebase/upload";
import { useToast } from "@/hooks/useToast";
import { Input } from "@/components/ui/input";

const DEFAULT_BANNERS = [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
];

export const BannerEditor = () => {
    const dispatch = useDispatch();
    const config = useSelector(selectConfiguration);
    const updating = useSelector(selectConfigurationUpdating);
    const toast = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (config) {
            setPreviewUrl(config.bannerUrl || DEFAULT_BANNERS[0]);
            setTitle(config.heroTitle || "");
            setSubtitle(config.heroSubtitle || "");
        } else {
            // Fallback for initial render without config
            setPreviewUrl(DEFAULT_BANNERS[0]);
        }
    }, [config]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (isEditing) setIsDragging(true);
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
            handleFileSelect(file);
        }
    };

    const handleFileSelect = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setSelectedFile(file);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const selectDefaultBanner = (url: string) => {
        setPreviewUrl(url);
        setSelectedFile(null); // Clear file since we are using a URL
    };

    const handleSave = async () => {
        if (!config) return;

        let finalBannerUrl = previewUrl;

        // If we have a file, upload it first
        if (selectedFile) {
            try {
                finalBannerUrl = await uploadImage(selectedFile, 'store-banners');
            } catch (error) {
                console.error("Failed to upload banner", error);
                toast.error("Error al subir banner", { description: "Hubo un problema subiendo la imagen." });
                return;
            }
        }

        // Dispatch update
        dispatch(updateConfigurationStart({
            ...config,
            bannerUrl: finalBannerUrl || "",
            heroTitle: title,
            heroSubtitle: subtitle
        }));

        setIsEditing(false);
        toast.vink("Portada actualizada", { description: "La imagen y los textos se han guardado." });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPreviewUrl(config?.bannerUrl || DEFAULT_BANNERS[0]);
        setTitle(config?.heroTitle || "");
        setSubtitle(config?.heroSubtitle || "");
        setSelectedFile(null);
    };

    return (
        <div className="rounded-[32px] border bg-card p-6 shadow-sm space-y-6 relative overflow-visible">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <LucideImage size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">Portada de la Tienda</h2>
                        <p className="text-sm text-muted-foreground">Personaliza la imagen, título y subtítulo de tu tienda.</p>
                    </div>
                </div>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)} className="rounded-xl gap-2">
                        <ImageIcon size={16} /> Editar Portada
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={handleCancel} className="rounded-xl text-muted-foreground hover:text-destructive">
                            <X size={16} className="mr-2" /> Cancelar
                        </Button>
                        <Button onClick={handleSave} disabled={updating} className="rounded-xl gap-2">
                            {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Guardar
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Preview Area */}
            <div
                className={cn(
                    "relative w-full h-48 rounded-2xl overflow-hidden transition-all border-2",
                    isEditing ? "border-dashed border-primary/50 cursor-pointer" : "border-transparent",
                    isDragging && "scale-[1.01] border-primary bg-primary/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => isEditing && fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt="Store Banner"
                        className={cn("w-full h-full object-cover transition-transform duration-700", isEditing && "hover:scale-105 opacity-80")}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <span className="font-medium animate-pulse">Cargando visualización...</span>
                    </div>
                )}

                {/* Text Overlay Preview */}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{title || "Título del Hero"}</h3>
                    <p className="text-white/90 font-medium drop-shadow-sm line-clamp-2 max-w-lg">{subtitle || "Subtítulo descriptivo de tu negocio"}</p>
                </div>

                {isEditing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                        <Upload size={32} className="mb-2 drop-shadow-md" />
                        <span className="font-bold drop-shadow-md">Haz clic o arrastra una imagen aquí</span>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                    onChange={handleFileInputChange}
                    disabled={!isEditing}
                />
            </div>

            {/* Editing Controls */}
            {isEditing && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Título Principal</label>
                            <Input
                                placeholder="Ej: Las mejores hamburguesas"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Subtítulo</label>
                            <Input
                                placeholder="Ej: Pide a domicilio sin complicaciones"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">O elige imagen de galería:</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {DEFAULT_BANNERS.map((url, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectDefaultBanner(url)}
                                    className={cn(
                                        "relative rounded-xl overflow-hidden h-16 border-2 transition-all hover:scale-105",
                                        previewUrl === url ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <img src={url} alt={`Banner Option ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
