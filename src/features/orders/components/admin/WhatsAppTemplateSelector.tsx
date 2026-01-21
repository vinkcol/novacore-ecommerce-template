"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Send, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Order } from "../../types";
import { useWhatsAppTemplates, WhatsAppTemplate } from "./useWhatsAppTemplates";
import { Badge } from "@/components/ui/badge";

interface WhatsAppTemplateSelectorProps {
    order: Order;
    phone: string;
}

export function WhatsAppTemplateSelector({ order, phone }: WhatsAppTemplateSelectorProps) {
    const { templates, addTemplate, updateTemplate, deleteTemplate, parseTemplate } = useWhatsAppTemplates();
    const [isOpen, setIsOpen] = useState(false);

    // Editor State
    const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
    const [previewMessage, setPreviewMessage] = useState("");

    // Form State (New/Edit)
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [templateName, setTemplateName] = useState("");
    const [templateContent, setTemplateContent] = useState("");

    // Effect to update preview when selection changes
    useEffect(() => {
        if (selectedTemplate) {
            setPreviewMessage(parseTemplate(selectedTemplate.content, order));
        } else {
            setPreviewMessage("");
        }
    }, [selectedTemplate, order, parseTemplate]);

    const handleSend = () => {
        if (!previewMessage) return;

        // Clean phone number (remove non-digits)
        const cleanPhone = phone.replace(/\D/g, '');
        // Default to Colombia code if not present (simple heuristic)
        const finalPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;

        const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(previewMessage)}`;
        window.open(url, '_blank');
        setIsOpen(false);
    };

    const handleSave = () => {
        if (!templateName || !templateContent) return;

        if (isEditing && editingId) {
            updateTemplate(editingId, { name: templateName, content: templateContent });
        } else {
            addTemplate({ name: templateName, content: templateContent });
        }

        // Reset
        setIsCreating(false);
        setIsEditing(false);
        setEditingId(null);
        setTemplateName("");
        setTemplateContent("");
    };

    const startEdit = (e: React.MouseEvent, template: WhatsAppTemplate) => {
        e.stopPropagation();
        setIsEditing(true);
        setIsCreating(true);
        setEditingId(template.id);
        setTemplateName(template.name);
        setTemplateContent(template.content);
    };

    const cancelEdit = () => {
        setIsCreating(false);
        setIsEditing(false);
        setEditingId(null);
        setTemplateName("");
        setTemplateContent("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700">
                    <MessageCircle size={14} />
                    WhatsApp
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="text-green-600" />
                        Mensajes Rápidos de WhatsApp
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Left Column: Template List */}
                    <div className="space-y-4 border-r pr-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Plantillas</h4>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                    setIsCreating(true);
                                    setIsEditing(false);
                                    setTemplateName("");
                                    setTemplateContent("");
                                }}
                            >
                                <Plus size={16} />
                            </Button>
                        </div>

                        {isCreating && (
                            <div className="bg-muted/50 p-3 rounded-xl space-y-3 animate-in fade-in zoom-in-95 border-2 border-primary/20">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] uppercase font-bold text-primary">{isEditing ? 'Editar plantilla' : 'Nueva plantilla'}</span>
                                </div>
                                <Input
                                    placeholder="Nombre (ej: Saludo)"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    className="h-8 text-sm"
                                />
                                <Textarea
                                    placeholder="Hola {{customer.name}}..."
                                    value={templateContent}
                                    onChange={(e) => setTemplateContent(e.target.value)}
                                    className="text-xs resize-none"
                                />
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancelar</Button>
                                    <Button size="sm" onClick={handleSave}>{isEditing ? 'Actualizar' : 'Guardar'}</Button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                            {templates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all hover:border-primary/50 relative group ${selectedTemplate?.id === template.id ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-card text-card-foreground'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <h5 className="font-bold text-sm mb-1">{template.name}</h5>
                                        <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => startEdit(e, template)}
                                                className="text-muted-foreground hover:text-primary p-1"
                                                title="Editar"
                                            >
                                                <Edit2 size={12} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteTemplate(template.id); }}
                                                className="text-muted-foreground hover:text-destructive p-1"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{template.content}</p>
                                </div>
                            ))}
                        </div>

                        {templates.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-xs text-muted-foreground mb-2">No hay plantillas guardadas</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Preview & Send */}
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4 text-primary">
                            <Send size={16} />
                            <h4 className="text-sm font-bold uppercase tracking-wider">Vista Previa</h4>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="bg-[#E5DDD5] p-4 rounded-xl min-h-[200px] relative">
                                <span className="absolute top-2 right-2 text-[10px] text-black/40 font-bold bg-white/50 px-2 py-0.5 rounded-full">
                                    WhatsApp Preview
                                </span>
                                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm whitespace-pre-wrap max-w-[90%] mt-4">
                                    {previewMessage || <span className="text-muted-foreground italic">Selecciona una plantilla...</span>}
                                </div>
                            </div>

                            <Textarea
                                value={previewMessage}
                                onChange={(e) => setPreviewMessage(e.target.value)}
                                placeholder="Puedes editar el mensaje final aquí..."
                                className="resize-none h-24"
                            />

                            <div className="flex flex-col gap-2">
                                <div className="text-[10px] text-muted-foreground text-center">
                                    Variables disponibles: <Badge variant="secondary" className="text-[9px] mx-1">Name</Badge> <Badge variant="secondary" className="text-[9px] mx-1">Order ID</Badge> <Badge variant="secondary" className="text-[9px] mx-1">Total</Badge>
                                </div>
                                <Button
                                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold gap-2"
                                    onClick={handleSend}
                                    disabled={!previewMessage}
                                >
                                    <Send size={16} />
                                    Enviar por WhatsApp
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
