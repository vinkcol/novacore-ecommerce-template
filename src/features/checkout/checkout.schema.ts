import * as Yup from "yup";
import locationData from "@/data/colombia.location.json";

// Extract defaults programmatically to avoid typos and hardcoding
const DEFAULT_DEPT_DATA = locationData.find(d => d.departamento.toLowerCase() === "cundinamarca");
const DEFAULT_CITY = DEFAULT_DEPT_DATA?.ciudades.find(c => c.toLowerCase() === "bogotá" || c.toLowerCase() === "bogota");

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
    locality: Yup.string().when("city", {
        is: (val: string) => val?.toLowerCase() === "bogota" || val?.toLowerCase() === "bogotá",
        then: (schema) => schema.required("La localidad es obligatoria"),
        otherwise: (schema) => schema.optional(),
    }),
    landmark: Yup.string()
        .required("Un punto de referencia ayuda a la entrega"),
    email: Yup.string()
        .email("Email inválido")
        .optional(),
    paymentMethod: Yup.string()
        .required("Selecciona un método de pago"),
    cashAmount: Yup.number().when("paymentMethod", {
        is: (val: string) => val === "cash",
        then: (schema) => schema
            .required("Indica con cuánto vas a pagar")
            .positive("El monto debe ser positivo")
            .typeError("Debe ser un número"),
        otherwise: (schema) => schema.optional(),
    }),

});

export type CheckoutFormValues = Yup.InferType<typeof checkoutValidationSchema>;

export const initialCheckoutValues: CheckoutFormValues = {
    firstName: "",
    lastName: "",
    whatsapp: "",
    backupPhone: "",
    address: "",
    department: DEFAULT_DEPT_DATA?.departamento || "",
    city: DEFAULT_CITY || "",
    locality: "",
    landmark: "",
    email: "",
    paymentMethod: "",
    cashAmount: undefined,

};
