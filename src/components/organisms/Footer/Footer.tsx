import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { useSelector } from "react-redux";
import shopContent from "@/data/shop-content.json";
import Logo from "@/components/atoms/Logo/Logo";
import { selectConfiguration } from "@/features/configuration/redux/configurationSelectors";
import FooterMap from "./FooterMap";

export function Footer() {
  const { footer, site } = shopContent;
  const config = useSelector(selectConfiguration);

  const socialConfig = config?.social;
  const locationConfig = config?.location;

  // Use config values if available, otherwise fallback to json
  const facebookUrl = socialConfig?.facebook || site.social.facebook;
  const instagramUrl = socialConfig?.instagram || site.social.instagram;
  const twitterUrl = socialConfig?.twitter || site.social.twitter;
  const linkedinUrl = socialConfig?.linkedin || site.social.linkedin;

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand & Social */}
          <div className="flex flex-col gap-6">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              {config?.description || footer.about}
            </p>
            <div className="flex gap-3">
              {[
                { url: facebookUrl, icon: Facebook },
                { url: instagramUrl, icon: Instagram },
                { url: twitterUrl, icon: Twitter },
                { url: linkedinUrl, icon: Linkedin },
              ].map(
                (social, index) =>
                  social.url && (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background transition-all hover:bg-muted hover:text-primary"
                    >
                      <social.icon className="h-4 w-4" />
                    </Link>
                  )
              )}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-foreground">
              Navegación
            </h3>
            <ul className="space-y-4">
              {[
                { label: "Inicio", href: "/" },
                { label: "Productos", href: "/products" },
                { label: "Contacto", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Contacto y Ubicación
            </h3>
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-medium truncate">{config?.email || site.email}</span>
              </div>

              {/* Phone */}
              {(config?.phone || site.phone) && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">{config?.phone || site.phone}</span>
                </div>
              )}

              {/* Address details */}
              <div className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-foreground">
                    {locationConfig?.city}, {locationConfig?.department}
                  </span>
                  {locationConfig?.locality && (
                    <span className="text-xs uppercase tracking-wide opacity-80">
                      Localidad: {locationConfig.locality}
                    </span>
                  )}
                  {locationConfig?.neighborhood && (
                    <span className="text-xs uppercase tracking-wide opacity-80">
                      Barrio: {locationConfig.neighborhood}
                    </span>
                  )}
                  <span className="text-xs italic">
                    {config?.address || "Dirección no especificada"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Map */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Nuestra Sede
            </h3>
            <div className="aspect-video lg:aspect-square w-full">
              {locationConfig?.lat && locationConfig?.lng ? (
                <FooterMap lat={locationConfig.lat} lng={locationConfig.lng} />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center">
                  <MapPin className="mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    Mapa no disponible
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {footer.copyright}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              PRIVACIDAD
            </Link>
            <Link
              href="/terms"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              TÉRMINOS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
