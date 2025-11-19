import { type RouteConfig, route } from "@react-router/dev/routes"

export default [
    route("/", "routes/_index.tsx"),
    route("game", "routes/game.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/verify/:token", "routes/auth/verify.$token.tsx"),
    route("auth/set-username/:token", "routes/auth/set-username.$token.tsx"),
    route("auth/change-username/:token", "routes/auth/change-username.$token.tsx"),
] satisfies RouteConfig