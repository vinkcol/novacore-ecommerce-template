"use client";

import React, { useRef } from 'react';
import QRCode from "react-qr-code";
import { Button } from '@/components/ui/button';
import { ExternalLink, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const StoreQRCard = () => {
    const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}` : '';
    const svgRef = useRef<any>(null);

    const handleDownload = () => {
        const svg = document.getElementById("store-qr-code");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = "store-qr-code.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    QR de la Tienda
                </CardTitle>
                <CardDescription>
                    Comparte este código para que tus clientes accedan al menú.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    {storeUrl && (
                        <QRCode
                            id="store-qr-code"
                            value={storeUrl}
                            size={200}
                            viewBox={`0 0 256 256`}
                        />
                    )}
                </div>

                <div className="flex w-full gap-3">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => window.open(storeUrl, '_blank')}
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Detalle
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleDownload}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
