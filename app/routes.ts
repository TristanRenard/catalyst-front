import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    route("admin", "routes/admin/index.tsx"),
    route("admin/user", "routes/admin/user/index.tsx"),
    route("admin/energy", "routes/admin/energy/index.tsx"),
    route("admin/situationCard", "routes/admin/situationCard/index.tsx"),
    index("routes/_index.tsx"),
    route("game", "routes/game.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
] satisfies RouteConfig;