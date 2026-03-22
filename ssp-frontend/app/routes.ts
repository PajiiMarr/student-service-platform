import { type RouteConfig, index, route, prefix, layout } from "@react-router/dev/routes";

export default [
    index('welcome/welcome.tsx'),
    route('login','routes/auth/login.tsx'),
    route('signup','routes/auth/signup.tsx'),

    route('profiling', 'routes/user/profiling.tsx')
] satisfies RouteConfig;