import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

function isLoggedIn() {
  // checks for login token and whether it is timed out
  if (
    localStorage.getItem("token_type") &&
    localStorage.getItem("access_token")
  ) {
    if (
      Date.now() - localStorage.getItem("loginTime") >
      Settings.loginTokenDuration
    ) {
      console.log("login timeout... ");
      logout("Login timeout, please login again");
      return false;
    } else {
      console.log("loggged in; " + localStorage.getItem("access_token"));
      return true;
    }
  } else {
    console.log("not logged in...");
    logout("You are not logged in!");
    return false;
  }
}

function logout(message = "You have been logged out!") {
  // deletes the login related data from localstorage
  localStorage.setItem("access_token", "");
  localStorage.setItem("token_type", "");
  localStorage.setItem("loginTime", 0);
  router.push({ name: "login", params: { message: message } });
}

export { logout, isLoggedIn };


const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/me",
    name: "userAbout",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "coreAboutMe" */ "../views/core/AboutMe.vue"),
  },
  {
    path: "/settings",
    name: "coreSettings",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "coreSettings" */ "../views/core/Settings.vue"),
  },
  {
    path: "/projects",
    name: "userProjects",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "coreSettings" */ "../views/core/Projects.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/*webpackChunkName: "login" */ "../views/login")
  },
  {
    path: '/404',
    alias: '*',
    name: 'notFound',
    component: () => 
      import(/* webpackChunkName: "notFound" */ "../components/NotFound")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// navigation guards (needed for login:)
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log("need for Logged In");
    // need to login!
    if (!isLoggedIn()) {
      next({
        name: "login"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
