"use client";

import React, { ReactNode } from "react";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { UserDropdown } from "@/features/admin/components/UserDropdown";
import { DateTimeCard } from "@/components/molecules/DateTimeCard/DateTimeCard";
interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <AdminSidebar />
            <div className="flex flex-1 flex-col md:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/80 px-8 backdrop-blur-md justify-between">
                    <h1 className="text-lg font-bold tracking-tight text-foreground/80">{title}</h1>
                    <div className="flex items-center gap-4">
                        <DateTimeCard />
                        <UserDropdown />
                    </div>
                </header>
                <main className="flex-1 p-8">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
