export interface ShippingRule {
    id: string; // generated UUID
    type: 'city' | 'department';
    value: string; // "Bogotá" or "Cundinamarca"
    cost: number;
    deliveryDays: {
        min: number;
        max: number;
    };
    allowCOD: boolean;
    isActive: boolean;
}

export interface ShippingConfig {
    rules: ShippingRule[];
    defaultRule: Omit<ShippingRule, 'id' | 'type' | 'value' | 'isActive'>;
}

export interface ShippingState {
    config: ShippingConfig | null;
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateSuccess: boolean;
}
