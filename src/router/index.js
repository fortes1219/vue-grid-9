import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
  },
  {
    path: "/extends",
    name: "Extends",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Extends.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
