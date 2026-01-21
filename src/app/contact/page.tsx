import { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Contacto | Vink",
    description: "Ponte en contacto con nosotros para cualquier duda o consulta.",
};

export default function ContactPage() {
    return (
        <ContentLayout>
            <div className="container mx-auto px-4 py-8 md:py-16">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Contáctanos</h1>
                    <p className="text-muted-foreground text-lg">
                        Estamos a un clic de distancia. Elige tu medio de contacto preferido.
                    </p>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-auto p-6 flex items-center justify-start gap-4 text-left text-lg hover:border-primary/50 hover:bg-muted/50 transition-all rounded-xl border-2"
                    >
                        <a href="mailto:contacto@vink.com">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold">Envíanos un Email</span>
                                <span className="text-sm text-muted-foreground font-normal">contacto@vink.com</span>
                            </div>
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-auto p-6 flex items-center justify-start gap-4 text-left text-lg hover:border-primary/50 hover:bg-muted/50 transition-all rounded-xl border-2"
                    >
                        <a href="tel:+1234567890">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold">Llámanos</span>
                                <span className="text-sm text-muted-foreground font-normal">+1 234 567 890</span>
                            </div>
                        </a>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        className="w-full h-auto p-6 flex items-center justify-start gap-4 text-left text-lg hover:border-primary/50 hover:bg-muted/50 transition-all rounded-xl border-2"
                    >
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold">Visítanos</span>
                                <span className="text-sm text-muted-foreground font-normal">Calle Principal 123, Ciudad</span>
                            </div>
                        </a>
                    </Button>

                    <Button
                        asChild
                        className="w-full h-auto p-6 flex items-center justify-center gap-3 text-lg font-bold text-white transition-all hover:opacity-90 rounded-xl shadow-lg border-2 border-transparent"
                        style={{ backgroundColor: "#25D366" }}
                    >
                        <a
                            href="https://wa.me/1234567890" // Reemplaza con el número real
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <FaWhatsapp className="h-8 w-8" />
                            Chatear en WhatsApp
                        </a>
                    </Button>
                </div>
            </div>
        </ContentLayout>
    );
}
