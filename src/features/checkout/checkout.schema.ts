import * as Yup from "yup";

export const checkoutValidationSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "Mínimo 2 caracteres")
        .required("El nombre es obligatorio"),
    lastName: Yup.string()
        .min(2, "Mínimo 2 caracteres")
        .required("El apellido es obligatorio"),
    whatsapp: Yup.string()
        .matches(/^[0-9+ ]+$/, "Número no válido")
        .min(10, "Mínimo 10 dígitos")
        .required("El WhatsApp es obligatorio"),
    backupPhone: Yup.string()
        .matches(/^[0-9+ ]+$/, "Número no válido")
        .optional(),
    address: Yup.string()
        .min(5, "Dirección muy corta")
        .required("La dirección es obligatoria"),
    department: Yup.string()
        .required("Seleccione un departamento"),
    city: Yup.string()
        .required("La ciudad es obligatoria"),
    landmark: Yup.string()
        .required("Un punto de referencia ayuda a la entrega"),
    email: Yup.string()
        .email("Email inválido")
        .optional(),
    commitment: Yup.boolean()
        .oneOf([true], "Debe comprometerse al pago"),
    priorityShipping: Yup.boolean(),
});

export type CheckoutFormValues = Yup.InferType<typeof checkoutValidationSchema>;

export const initialCheckoutValues: CheckoutFormValues = {
    firstName: "",
    lastName: "",
    whatsapp: "",
    backupPhone: "",
    address: "",
    department: "",
    city: "",
    landmark: "",
    email: "",
    commitment: false,
    priorityShipping: false,
};
