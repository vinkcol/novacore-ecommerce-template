"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isFirst = index === 0;

                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
                            )}
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className={`flex items-center hover:text-primary transition-colors ${isFirst ? "font-medium text-primary" : ""
                                        }`}
                                >
                                    {isFirst && <Home className="mr-1 h-4 w-4" />}
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    className={`font-medium ${isLast ? "text-foreground" : ""
                                        } truncate max-w-[200px] md:max-w-xs`}
                                    title={item.label}
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
