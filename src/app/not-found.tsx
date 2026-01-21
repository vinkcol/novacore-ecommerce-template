'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-background p-4 text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8 flex items-center justify-center"
            >
                <div className="absolute h-52 w-52 animate-pulse rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-4 border-muted/30 bg-card shadow-2xl">
                    <UtensilsCrossed className="h-20 w-20 text-primary" strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                    ?
                </div>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
            >
                <h1 className="mb-2 text-6xl font-black tracking-tighter text-foreground/10 select-none">
                    404
                </h1>
                <h2 className="mb-4 -mt-8 text-3xl font-bold text-foreground">
                    ¡Plato no encontrado!
                </h2>
                <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                    Lo sentimos, parece que la página que buscas no está en nuestro menú del día.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto" onClick={() => window.history.back()}>
                        <ArrowLeft className="h-4 w-4" />
                        Regresar
                    </Button>
                    <Link href="/" className="w-full sm:w-auto">
                        <Button size="lg" className="gap-2 w-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                            <Home className="h-4 w-4" />
                            Ir al Inicio
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
