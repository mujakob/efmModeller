import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/core/Projects.vue"; //"../views/Home.vue";
import store from "../store";

Vue.use(VueRouter);

// function isLoggedIn() {
//   // checks for login token and whether it is timed out
//   if (
//     localStorage.getItem("token_type") &&
//     localStorage.getItem("access_token")
//   ) {
//     if (
//       Date.now() - localStorage.getItem("loginTime") >
//       Settings.loginTokenDuration
//     ) {
//       console.log("login timeout... ");
//       logout("Login timeout, please login again");
//       return false;
//     } else {
//       console.log("loggged in; " + localStorage.getItem("access_token"));
//       return true;
//     }
//   } else {
//     console.log("not logged in...");
//     logout("You are not logged in!");
//     return false;
//   }
// }

// function logout(message = "You have been logged out!") {
//   // deletes the login related data from localstorage
//   localStorage.setItem("access_token", "");
//   localStorage.setItem("token_type", "");
//   localStorage.setItem("loginTime", 0);
//   router.push({ name: "login", params: { message: message } });
// }

// export { logout };

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/me",
    name: "userAbout",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "coreAboutMe" */ "../views/core/AboutMe.vue"),
  },
  {
    path: "/settings",
    name: "coreSettings",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "coreSettings" */ "../views/core/Settings.vue"
      ),
  },
  {
    path: "/projects",
    name: "userProjects",
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "coreSettings" */ "../views/core/Projects.vue"
      ),
  },
  {
    path: "/project/:treeID",
    name: "efm-project",
    props: true,
    meta: { requiresAuth: true },
    component: () =>
      import(
        /* webpackChunkName: "coreSettings" */ "../views/efm/efmWorkspace.vue"
      ),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/*webpackChunkName: "login" */ "../components/core/login"),
  },
  {
    path: "/404",
    alias: "*",
    name: "notFound",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../components/NotFound"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// navigation guards (needed for login:)
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    console.log("need for Logged In");
    console.log("log in status" + store.getters.loggedIn);
    // need to login!
    if (!store.getters.loggedIn) {
      next({
        name: "login",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
