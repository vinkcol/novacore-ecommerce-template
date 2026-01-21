import { StorefrontCollectionsTemplate } from "@/features/collections/components/templates/StorefrontCollectionsTemplate";

interface CollectionPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CollectionPage(props: CollectionPageProps) {
    const params = await props.params;
    return <StorefrontCollectionsTemplate slug={params.slug} />;
}
