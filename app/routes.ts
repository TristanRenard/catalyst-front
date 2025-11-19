import {
    type RouteConfig,
    index,
    layout,
    route,
} from "@react-router/dev/routes"

export default [
    index("routes/index.tsx"),
    route("game", "routes/game.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/verify/:token", "routes/auth/verify.$token.tsx"),
    route("auth/set-username/:token", "routes/auth/set-username.$token.tsx"),
    route("auth/change-username/:token", "routes/auth/change-username.$token.tsx"),
    layout("routes/admin/_layout.tsx", [
        route("admin", "routes/admin/index.tsx"),
        route("admin/leaderboard", "routes/admin/leaderboard.tsx"),
        route("admin/cards/create", "routes/admin/cards/create.tsx"),
        route("admin/cards", "routes/admin/cards/index.tsx"),
        route("admin/energies/create", "routes/admin/energies/create.tsx"),
        route("admin/energies", "routes/admin/energies/index.tsx"),
        route("admin/games/history", "routes/admin/games/history.tsx"),
        route("admin/users", "routes/admin/users/index.tsx"),
        route("admin/library", "routes/admin/library/index.tsx"),
    ]),
] satisfies RouteConfig
