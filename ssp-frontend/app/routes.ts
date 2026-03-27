import { type RouteConfig, index, route, prefix, layout } from "@react-router/dev/routes";

export default [
    index('welcome/welcome.tsx'),
    route('signin', 'routes/auth/signin.tsx'),
    route('signup', 'routes/auth/signup.tsx'),
    
    ...prefix("admin", [
        index('routes/user/admin/dashboard.tsx'),
        route('users', 'routes/user/admin/users.tsx'),
        // route('jobs', 'routes/user/admin/jobs.tsx'),
        // route('colleges', 'routes/user/admin/colleges.tsx'),
        // route('transactions', 'routes/user/admin/transactions.tsx'),
    ]),
    
    ...prefix("student", [
        index('routes/user/student/home.tsx'),
        route('profiling', 'routes/user/student/profiling.tsx'),
        // route('jobs', 'routes/user/admin/jobs.tsx'),
        // route('colleges', 'routes/user/admin/colleges.tsx'),
        // route('transactions', 'routes/user/admin/transactions.tsx'),
    ]),
] satisfies RouteConfig;