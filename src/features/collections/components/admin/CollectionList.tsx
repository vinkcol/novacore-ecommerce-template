"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Loader2, ArrowLeft, Library, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/useToast";
import { CollectionModal } from "./CollectionModal";
import { CollectionDetailModal } from "./CollectionDetailModal";
import { Collection } from "../../types/collection.types";
import {
    fetchCollectionsStart,
    deleteCollectionStart,
    resetCollectionStatus
} from "../../redux/adminCollectionsSlice";
import {
    selectCollections,
    selectCollectionsLoading,
    selectCollectionsDeleting,
    selectCollectionsDeleteSuccess
} from "../../redux/adminCollectionsSelectors";
import Link from "next/link";

export function CollectionList() {
    const router = useRouter();
    const dispatch = useDispatch();
    const toast = useToast();

    // Redux State
    const collections = useSelector(selectCollections);
    const loading = useSelector(selectCollectionsLoading);
    const deleting = useSelector(selectCollectionsDeleting);
    const deleteSuccess = useSelector(selectCollectionsDeleteSuccess);

    // Local UI State
    const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchCollectionsStart());
    }, [dispatch]);

    useEffect(() => {
        if (deleteSuccess) {
            toast.vink('Colección eliminada', {
                description: 'La colección ha sido removida del sistema.'
            });
            dispatch(resetCollectionStatus());
        }
    }, [deleteSuccess, dispatch, toast]);

    const handleCreate = () => {
        setSelectedCollection(null);
        setIsModalOpen(true);
    };

    const handleEdit = (collectionItem: Collection) => {
        setSelectedCollection(collectionItem);
        setIsModalOpen(true);
    };

    const handleView = (collectionItem: Collection) => {
        setSelectedCollection(collectionItem);
        setIsDetailOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar esta colección?")) {
            dispatch(deleteCollectionStart(id));
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <Link
                    href="/admin/products"
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Volver a Productos
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        className="w-full bg-background border rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        placeholder="Buscar colecciones..."
                    />
                </div>
                <button
                    onClick={handleCreate}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <Plus size={18} />
                    Nueva Colección
                </button>
            </div>

            <div className="overflow-hidden rounded-[32px] border bg-card shadow-sm relative">
                {(loading || deleting) && (
                    <div className="absolute inset-0 z-10 bg-card/40 backdrop-blur-[1px] flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                <table className="w-full border-collapse text-left">
                    <thead className="bg-muted/30 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <tr>
                            <th className="px-6 py-5">Nombre</th>
                            <th className="px-6 py-5">Slug</th>
                            <th className="px-6 py-5">Estado</th>
                            <th className="px-6 py-5 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm font-medium">
                        {collections.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground">
                                    No hay colecciones registradas.
                                </td>
                            </tr>
                        ) : (
                            collections.map((collectionItem) => (
                                <tr key={collectionItem.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-foreground leading-none mb-1">{collectionItem.name}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">{collectionItem.description}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono">{collectionItem.slug}</td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={collectionItem.isActive ? "outline" : "destructive"}
                                            className={collectionItem.isActive ? "border-green-500 text-green-600 bg-green-50/50" : ""}
                                        >
                                            {collectionItem.isActive ? "Activa" : "Inactiva"}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(collectionItem)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-primary"
                                                title="Ver detalle"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(collectionItem)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-blue-600"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(collectionItem.id)}
                                                className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-destructive"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <CollectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                collectionItem={selectedCollection}
            />

            <CollectionDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                collection={selectedCollection}
            />
        </div>
    );
}
