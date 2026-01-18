"use client";

import React, { useState, useMemo } from "react";
import colombiaData from "@/data/colombia.location.json";
import { ChevronRight, ChevronDown, Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface SelectedLocation {
    type: 'city' | 'department';
    value: string;
}

interface LocationTreeSelectorProps {
    selected: SelectedLocation[];
    onChange: (selected: SelectedLocation[]) => void;
    unavailableLocations?: SelectedLocation[];
}

export function LocationTreeSelector({ selected, onChange, unavailableLocations = [] }: LocationTreeSelectorProps) {

    const [searchQuery, setSearchQuery] = useState("");
    const [expandedDeps, setExpandedDeps] = useState<string[]>([]);

    const toggleDepartment = (dep: string) => {
        setExpandedDeps(prev =>
            prev.includes(dep) ? prev.filter(d => d !== dep) : [...prev, dep]
        );
    };

    const isUnavailable = (type: 'city' | 'department', value: string) => {
        return unavailableLocations.some(u => u.type === type && u.value === value);
    };

    const handleSelect = (type: 'city' | 'department', value: string) => {
        if (isUnavailable(type, value)) return;

        const exists = selected.find(s => s.type === type && s.value === value);
        if (exists) {
            onChange(selected.filter(s => !(s.type === type && s.value === value)));
        } else {
            onChange([...selected, { type, value }]);
        }
    };

    const isSelected = (type: 'city' | 'department', value: string) => {
        return !!selected.find(s => s.type === type && s.value === value);
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return colombiaData;
        const lowerQuery = searchQuery.toLowerCase();

        return colombiaData.map(dep => {
            const matchesDep = dep.departamento.toLowerCase().includes(lowerQuery);
            const matchingCities = dep.ciudades.filter(city => city.toLowerCase().includes(lowerQuery));

            if (matchesDep || matchingCities.length > 0) {
                return {
                    ...dep,
                    ciudades: matchesDep ? dep.ciudades : matchingCities
                };
            }
            return null;
        }).filter(Boolean) as typeof colombiaData;
    }, [searchQuery]);

    // Auto-expand if searching
    useMemo(() => {
        if (searchQuery) {
            setExpandedDeps(filteredData.map(d => d.departamento));
        }
    }, [filteredData, searchQuery]);

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                <Input
                    placeholder="Buscar departamentos o ciudades..."
                    className="pl-8 h-8 text-sm bg-secondary/50 border-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="border rounded-xl h-[300px] overflow-y-auto bg-card p-2 space-y-1">
                {filteredData.map((dep) => {
                    const deptUnavailable = isUnavailable('department', dep.departamento);

                    return (
                        <div key={dep.departamento} className="select-none">
                            {/* Department Header */}
                            <div className={`flex items-center gap-2 p-1.5 rounded-lg group ${deptUnavailable ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/50'}`}>
                                <button
                                    type="button"
                                    onClick={() => !deptUnavailable && toggleDepartment(dep.departamento)}
                                    className="p-0.5 hover:bg-muted rounded text-muted-foreground"
                                >
                                    {expandedDeps.includes(dep.departamento) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>

                                <div
                                    className={`flex items-center justify-center h-4 w-4 rounded border ${isSelected('department', dep.departamento) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'} cursor-pointer transition-colors ${deptUnavailable ? 'bg-muted border-muted-foreground/20 cursor-not-allowed' : ''}`}
                                    onClick={() => handleSelect('department', dep.departamento)}
                                >
                                    {isSelected('department', dep.departamento) && <Check size={10} strokeWidth={4} />}
                                </div>

                                <span
                                    className="text-sm font-medium flex-1 cursor-pointer"
                                    onClick={() => !deptUnavailable && toggleDepartment(dep.departamento)}
                                >
                                    {dep.departamento}
                                    {deptUnavailable && <span className="ml-2 text-[10px] text-muted-foreground bg-muted px-1 rounded">(Asignado)</span>}
                                </span>
                            </div>

                            {/* Cities List */}
                            {expandedDeps.includes(dep.departamento) && (
                                <div className="ml-7 grid grid-cols-1 gap-0.5 border-l px-2 py-1">
                                    {dep.ciudades.map(city => {
                                        const cityUnavailable = isUnavailable('city', city);
                                        return (
                                            <div key={city} className={`flex items-center gap-2 p-1 rounded-lg ${cityUnavailable ? 'opacity-50 pointer-events-none' : 'hover:bg-muted/50'}`}>
                                                <div
                                                    className={`flex items-center justify-center h-4 w-4 rounded border ${isSelected('city', city) ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'} cursor-pointer transition-colors ${cityUnavailable ? 'bg-muted border-muted-foreground/20 cursor-not-allowed' : ''}`}
                                                    onClick={() => handleSelect('city', city)}
                                                >
                                                    {isSelected('city', city) && <Check size={10} strokeWidth={4} />}
                                                </div>
                                                <span
                                                    className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                                                    onClick={() => handleSelect('city', city)}
                                                >
                                                    {city}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredData.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                        No se encontraron resultados
                    </div>
                )}
            </div>

            <div className="flex flex-wrap gap-1 min-h-[24px]">
                {selected.length > 0 && (
                    <div className="text-xs text-muted-foreground w-full mb-1">
                        Seleccionados ({selected.length}):
                    </div>
                )}
                {selected.slice(0, 5).map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 h-5 font-normal">
                        {s.value} <span className="ml-1 opacity-50">{s.type === 'department' ? '(Dep)' : ''}</span>
                    </Badge>
                ))}
                {selected.length > 5 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-normal">
                        +{selected.length - 5} más
                    </Badge>
                )}
            </div>
        </div>
    );
}
