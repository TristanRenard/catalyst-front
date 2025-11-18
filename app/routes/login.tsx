import { Login } from "~/welcome/login";

export function meta() {
    return [
        { title: "Login - Catalyst" },
        { name: "description", content: "Connectez-vous à Catalyst" },
    ];
}

export default function LoginRoute() {
    return <Login />;
}