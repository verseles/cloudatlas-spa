const routes = [
  {
    path: "/login",
    component: () => import("layouts/login-layout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/login/login.vue"),
        meta: {
          unguarded: true
        }
      }
    ]
  },
  {
    path: "/logout",
    component: () => import("components/login/logout.vue")
  },
  {
    path: "/",
    component: () => import("layouts/main-layout.vue"),
    children: [{ path: "", component: () => import("pages/index.vue") }]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/error404.vue")
  });
}

export default routes;
