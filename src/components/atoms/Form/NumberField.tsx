"use client";

import React from "react";
import { TextField } from "./TextField";
import { Hash } from "lucide-react";

type NumberFieldProps = React.ComponentProps<typeof TextField>;

export function NumberField(props: NumberFieldProps) {
    return (
        <TextField
            type="number"
            icon={Hash}
            {...props}
        />
    );
}
