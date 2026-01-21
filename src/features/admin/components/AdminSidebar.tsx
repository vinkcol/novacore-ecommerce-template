"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { adminRooms } from "@/config/admin/rooms";
import Logo from "@/components/atoms/Logo/Logo";

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
            <div className="flex h-full flex-col px-3 py-4">
                <div className="mb-10 px-4 flex items-center justify-center gap-3">
                    <Logo />
                </div>

                <nav className="flex-1 space-y-1">
                    {adminRooms
                        .filter((room) => room.hasNavItem)
                        .map((room) => {
                            const Icon = room.icon;
                            const isActive = pathname === room.path;

                            return (
                                <Link
                                    key={room.id}
                                    href={room.path}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground hover:px-5"
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground")} />
                                    {room.label}
                                </Link>
                            );
                        })}
                </nav>

                <div className="mt-auto pt-4 border-t">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="h-9 w-9 rounded-full bg-muted border-2 border-primary/10" />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold leading-none">Super Admin</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">foodie_portal</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
