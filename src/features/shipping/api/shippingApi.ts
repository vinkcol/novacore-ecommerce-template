import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ShippingConfig, ShippingRule } from "../types/shipping.types";
import { v4 as uuidv4 } from "uuid";
import defaultCoverage from "@/data/shipping-coverage.json";

const SETTINGS_COLLECTION = "settings";
const SHIPPING_DOC_ID = "shipping";

export const shippingApi = {
    async fetchShippingConfig(): Promise<ShippingConfig> {
        try {
            const docRef = doc(db, SETTINGS_COLLECTION, SHIPPING_DOC_ID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as ShippingConfig;
            } else {
                // Initialize with default JSON data if not in DB
                // Map the JSON structure to our interface
                const initialRules: ShippingRule[] = (defaultCoverage.rules || []).map((rule: any) => ({
                    id: uuidv4(),
                    type: rule.type,
                    value: rule.values ? rule.values[0] : "", // Simplified mapping for now, handle arrays?
                    // The legacy JSON had "values": ["Bogota", "Soacha"], we might need to split this into multiple rules or change the type to support array.
                    // For the UI simplicity, 1 Rule = 1 Location is easier to manage.
                    // Let's assume we split them if there are multiple.
                    cost: rule.cost,
                    deliveryDays: rule.deliveryDays,
                    allowCOD: rule.allowCOD !== undefined ? rule.allowCOD : true,
                    isActive: true
                }));

                // Handle the array values in legacy JSON
                const expandedRules: ShippingRule[] = [];
                (defaultCoverage.rules || []).forEach((rule: any) => {
                    if (rule.values && Array.isArray(rule.values)) {
                        rule.values.forEach((val: string) => {
                            expandedRules.push({
                                id: uuidv4(),
                                type: rule.type,
                                value: val,
                                cost: rule.cost,
                                deliveryDays: rule.deliveryDays,
                                allowCOD: rule.allowCOD !== undefined ? rule.allowCOD : true,
                                isActive: true
                            });
                        });
                    }
                });

                const defaultConfig: ShippingConfig = {
                    rules: expandedRules,
                    defaultRule: {
                        cost: defaultCoverage.default.cost,
                        deliveryDays: defaultCoverage.default.deliveryDays,
                        allowCOD: defaultCoverage.default.allowCOD
                    }
                };

                // Save this initial state to DB
                await setDoc(docRef, defaultConfig);
                return defaultConfig;
            }
        } catch (error) {
            console.error("Error fetching shipping config:", error);
            throw error;
        }
    },

    async updateShippingConfig(config: ShippingConfig): Promise<ShippingConfig> {
        try {
            const docRef = doc(db, SETTINGS_COLLECTION, SHIPPING_DOC_ID);
            await setDoc(docRef, config);
            return config;
        } catch (error) {
            console.error("Error updating shipping config:", error);
            throw error;
        }
    }
};
