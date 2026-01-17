"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaRegPaperPlane } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { shopConfig } from "@/data/shop-config";

export function FloatingWhatsApp() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");

    // No mostrar en rutas de administrador
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!message.trim()) return;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${shopConfig.whatsapp.number}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
        setMessage("");
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="w-[340px] overflow-hidden rounded-[24px] bg-white shadow-2xl border border-gray-100 mb-2"
                    >
                        {/* Header */}
                        <div className="bg-[#075E54] p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                        <FaWhatsapp className="h-6 w-6" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-[#075E54]"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">WhatsApp</h4>
                                    <p className="text-[11px] opacity-80">En línea</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-black/10 rounded-full p-1 transition-colors"
                            >
                                <IoClose className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Chat Body (Background Patterns) */}
                        <div
                            className="h-[300px] bg-[#E5DDD5] p-4 overflow-y-auto relative flex flex-col justify-end"
                            style={{
                                backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                                backgroundSize: 'contain',
                                backgroundRepeat: 'repeat'
                            }}
                        >
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-xs relative mb-2">
                                <p className="text-gray-800">¡Hola! 👋<br />¿En qué podemos ayudarte hoy?</p>
                                <span className="absolute top-0 -left-2 w-0 h-0 border-t-[8px] border-t-white border-l-[8px] border-l-transparent"></span>
                                <p className="text-[10px] text-gray-400 text-right mt-1">Soporte Vink</p>
                            </div>
                        </div>

                        {/* Input Footer */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2 items-center">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 rounded-full bg-gray-50 border-gray-200 text-xs h-10 px-4 focus-visible:ring-green-500"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full bg-[#075E54] hover:bg-[#128C7E] h-10 w-10 shrink-0"
                            >
                                <FaRegPaperPlane className="h-4 w-4 text-white" />
                            </Button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-gray-100 text-gray-600 rotate-90' : 'bg-[#25D366] text-white'
                    }`}
            >
                {isOpen ? <IoClose className="h-8 w-8" /> : <FaWhatsapp className="h-9 w-9" />}
            </motion.button>
        </div>
    );
}
