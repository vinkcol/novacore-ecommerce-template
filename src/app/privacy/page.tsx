import React from "react";

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
            <div className="prose dark:prose-invert">
                <p>
                    En Foodie, valoramos su privacidad. Esta política explica cómo recopilamos, usamos y protegemos su información personal.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">1. Recopilación de Información</h2>
                <p>
                    Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta, realiza un pedido o se pone en contacto con nosotros.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">2. Uso de la Información</h2>
                <p>
                    Utilizamos la información recopilada para procesar sus pedidos, mejorar nuestros servicios y comunicarnos con usted.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">3. Seguridad</h2>
                <p>
                    Implementamos medidas de seguridad para proteger su información personal contra el acceso no autorizado.
                </p>

                <p className="mt-8 text-sm text-muted-foreground">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
}
