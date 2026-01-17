import { LayoutDashboard, ShoppingBag, Package, Settings } from "lucide-react";

export type AdminRole = 'super_admin';

export interface AdminRoom {
    id: string;
    label: string;
    path: string;
    hasNavItem: boolean;
    icon?: any;
    allowedRoles: AdminRole[];
}

export const adminRooms: AdminRoom[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        hasNavItem: true,
        icon: LayoutDashboard,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'orders',
        label: 'Ordenes',
        path: '/admin/orders',
        hasNavItem: true,
        icon: ShoppingBag,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'products',
        label: 'Productos',
        path: '/admin/products',
        hasNavItem: true,
        icon: Package,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'new-product',
        label: 'Nuevo Producto',
        path: '/admin/products/new',
        hasNavItem: false,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'categories',
        label: 'Categorías',
        path: '/admin/categories',
        hasNavItem: false,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'profile',
        label: 'Mi Perfil',
        path: '/admin/profile',
        hasNavItem: false,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'collections',
        label: 'Colecciones',
        path: '/admin/collections',
        hasNavItem: false,
        allowedRoles: ['super_admin'],
    },
    {
        id: 'configuration',
        label: 'Configuración',
        path: '/admin/configuration',
        hasNavItem: true,
        icon: Settings,
        allowedRoles: ['super_admin'],
    }
];
