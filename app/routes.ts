import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
<<<<<<< HEAD
    route("admin", "routes/admin/index.tsx"),
    route("admin/user", "routes/admin/user/index.tsx"),
    route("admin/energy", "routes/admin/energy/index.tsx"),
    route("admin/situationCard", "routes/admin/situationCard/index.tsx"),
    index("routes/_index.tsx"),
    route("game", "routes/game.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
] satisfies RouteConfig;
=======
  index("routes/index.tsx"),
  route("game", "routes/game.tsx"),
  route("auth/login", "routes/auth/login.tsx"),
  layout("routes/admin/_layout.tsx", [
    route("admin", "routes/admin/index.tsx"),
    route("admin/cards", "routes/admin/cards/index.tsx"),
    route("admin/energies", "routes/admin/energies/index.tsx"),
    route("admin/energies/create", "routes/admin/energies/create.tsx"),
    route("admin/cards/create", "routes/admin/cards/create.tsx"),
    route("admin/games/history", "routes/admin/games/history.tsx"),
  ]),
] satisfies RouteConfig;
>>>>>>> d5db8ee (feat: Add admin token modal and related hooks for admin authentication)
