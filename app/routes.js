import { index, prefix, route } from "@react-router/dev/routes";

export default [
    index('routes/home.jsx'),
    route('login', 'routes/login.jsx'),
    route('register', 'routes/register.jsx'),
    ...prefix('language', [
        route(":lang_id", 'routes/languages/learn.jsx'), 
       route(":lang_id/edit", 'routes/languages/edit.jsx'), 
    ]),
];
