import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Order } from '../../types';
import { RootState } from '@/redux/store';
import {
    fetchTemplatesRequest,
    createTemplateRequest,
    updateTemplateRequest,
    deleteTemplateRequest
} from '@/features/configuration/redux/whatsappTemplatesSlice';
import { WhatsAppTemplate } from '@/features/configuration/api/whatsappTemplatesApi';

import shopContent from '@/data/shop-content.json';

export type { WhatsAppTemplate };

// Default templates generator that includes the store name
const generateDefaultTemplates = (storeName: string): Omit<WhatsAppTemplate, 'id'>[] => [
    {
        name: 'Confirmación de Pedido',
        content: `Hola {{customer.name}}! 👋 Gracias por tu pedido en ${storeName}. Hemos recibido tu orden #{{order.id}}. Te avisaremos cuando esté lista.`
    },
    {
        name: 'En Camino',
        content: `¡Buenas noticias {{customer.name}}! 🛵 Tu pedido de ${storeName} ya va en camino a: {{order.address}}. El repartidor llegará pronto.`
    },
    {
        name: 'Pedido Entregado',
        content: `¡Esperamos que disfrutes tu comida! 🍔 Gracias por elegir ${storeName}. Nos encantaría saber qué te pareció.`
    },
    {
        name: 'Pedido Cancelado',
        content: `Hola {{customer.name}}, lamentamos informarte que tu pedido #{{order.id}} en ${storeName} ha sido cancelado. Por favor contáctanos para más detalles.`
    }
];

export function useWhatsAppTemplates() {
    const dispatch = useDispatch();
    const { items: rawTemplates, loading, error } = useSelector((state: RootState) => state.whatsappTemplates);
    const [hasChecked, setHasChecked] = useState(false);

    // Deduplicate templates to prevent UI errors
    const templates = useMemo(() => {
        const unique = new Map();
        rawTemplates.forEach(t => unique.set(t.id, t));
        return Array.from(unique.values());
    }, [rawTemplates]);

    // Initial fetch
    useEffect(() => {
        dispatch(fetchTemplatesRequest());
    }, [dispatch]);

    // Seed if empty after loading
    useEffect(() => {
        // Only run if not loading, no error, empty templates, and we haven't already seeded/checked this session
        if (!loading && !error && templates.length === 0 && !hasChecked) {
            setHasChecked(true); // Mark as checked/seeding to prevent loops

            // Seed defaults
            const defaults = generateDefaultTemplates(shopContent.site.name || "Nuestra Tienda");
            defaults.forEach(template => {
                dispatch(createTemplateRequest(template));
            });
        } else if (!loading && templates.length > 0) {
            setHasChecked(true); // If we have templates, mark as checked so we don't seed later
        }
    }, [dispatch, templates.length, loading, error, hasChecked]);

    const addTemplate = (template: Omit<WhatsAppTemplate, 'id'>) => {
        dispatch(createTemplateRequest(template));
    };

    const updateTemplate = (id: string, updates: Partial<WhatsAppTemplate>) => {
        dispatch(updateTemplateRequest({ id, updates }));
    };

    const deleteTemplate = (id: string) => {
        dispatch(deleteTemplateRequest(id));
    };

    const parseTemplate = (content: string, order: Order) => {
        if (!order) return content;

        let parsed = content;

        const replacements: Record<string, string> = {
            '{{customer.name}}': order.shipping.firstName,
            '{{order.id}}': order.id.slice(0, 8).toUpperCase(),
            '{{order.total}}': new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(order.total),
            '{{order.address}}': order.shipping.address,
            '{{order.status}}': order.status === 'pending' ? 'Pendiente' :
                order.status === 'processing' ? 'En preparación' :
                    order.status === 'shipped' ? 'En camino' : 'Entregado'
        };

        Object.entries(replacements).forEach(([key, value]) => {
            parsed = parsed.replaceAll(key, value || '');
        });

        return parsed;
    };

    return {
        templates,
        loading,
        error,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        parseTemplate
    };
}
