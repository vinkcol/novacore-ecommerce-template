import React from "react";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
            <div className="prose dark:prose-invert">
                <p>
                    Bienvenido a Foodie. Al acceder o utilizar nuestro sitio web, usted acepta estar sujeto a estos Términos y Condiciones.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">1. Uso del Servicio</h2>
                <p>
                    Usted se compromete a utilizar nuestro servicio solo para fines legales y de acuerdo con estos términos.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">2. Pedidos y Pagos</h2>
                <p>
                    Todos los pedidos están sujetos a disponibilidad y confirmación del precio. Nos reservamos el derecho de rechazar cualquier pedido.
                </p>

                <h2 className="text-xl font-semibold mt-4 mb-2">3. Cambios en los Términos</h2>
                <p>
                    Podemos actualizar estos términos en cualquier momento. Le recomendamos que los revise periódicamente.
                </p>

                <p className="mt-8 text-sm text-muted-foreground">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
}
