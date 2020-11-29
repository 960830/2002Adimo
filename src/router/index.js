import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [

  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/login.vue")
  },
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/home.vue"),
    redirect: "/list",
    children: [
      {
        path: "/list",
        name: "list",
        component: () => import("@/views/list.vue"),
        meta:{
          bread:[{name:"首页"}]
        }
      },
      {
        path: "/users",
        name: "users",
        component: () => import("@/views/users/users.vue"),
        meta:{
          bread:[{name:"用户列表"}]
        }
      },
      {
        path: "/roles",
        name: "juese",
        component: () => import("@/views/quan/juese.vue"),
        meta:{
          bread:[{name:"角色管理"}]
        }
      },
      {
        path: "/rights",
        name: "list",
        component: () => import("@/views/quan/list.vue"),
        meta:{
          bread:[{name:"权限列表"}]
        }
      },
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
