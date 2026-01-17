export interface Collection {
    id: string;
    name: string;
    description?: string;
    slug: string;
    isActive: boolean;
    imageUrl?: string;
    productIds?: string[];
    createdAt?: string;
    updatedAt?: string;
}
