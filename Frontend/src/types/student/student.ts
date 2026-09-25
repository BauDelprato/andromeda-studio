export interface student {
    id: number;
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    email: string;
    fitnessCertificate: boolean;
    notes: string | null;
    isActive: boolean;
    createdAt: string;
}