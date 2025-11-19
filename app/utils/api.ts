import axios from 'axios';

// URL de base de votre backend
const API_BASE_URL = 'http://localhost:3000';

/**
 * Configure une instance d'Axios avec l'URL de base.
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Types pour les Payloads et Réponses ---

interface LoginPayload {
    email: string;
}

interface VerifyPayload {
    username: string;
    verificationToken: string;
}

interface VerifyResponse {
    message: string;
    token: string;
}

export interface User {
    id: string;
    username: string | null;
    email: string | null;
    verificationToken: string | null;
    verificationTokenExpiresAt: Date | null;
    verifiedAt: Date | null;
    createdAt: Date;
    ratio: number;
}

// --- Fonctions API ---

export async function requestLogin(data: LoginPayload): Promise<void> {
    try {
        await api.post('/login', data);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Échec de la demande de connexion au backend.");
        }
        throw new Error("Erreur de connexion au service d'API.");
    }
}

export async function verifyToken(data: VerifyPayload): Promise<string> {
    try {
        const response = await api.post<VerifyResponse>('/verify', data);
        return response.data.token; 
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Le token de vérification est invalide ou a expiré.");
        }
        throw new Error("Erreur de connexion au service de vérification.");
    }
}

export async function fetchUsers(): Promise<User[]> {
    try {
        const response = await api.get<User[]>('/users');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || "Erreur lors de la récupération des utilisateurs.");
        }
        throw new Error("Erreur de connexion au service utilisateurs.");
    }
}