"use client";

import React from "react";
import { Phone } from "lucide-react";
import { TextField } from "./TextField";

type PhoneFieldProps = React.ComponentProps<typeof TextField>;

export function PhoneField(props: PhoneFieldProps) {
    return (
        <TextField
            type="tel"
            icon={Phone}
            placeholder="Ej: 321 456 7890"
            {...props}
        />
    );
}
