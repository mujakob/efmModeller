import Vue from "vue";
import Vuex from "vuex";
import Settings from "@/settings";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    // {
    //   "id": 1,
    //   "username": "admin",
    //   "email": null,
    //   "full_name": null,
    //   "disabled": null,
    //   "scopes": "admin"
    // }
    errors: [],
    // {
    //   msg: String,
    //   compnent: string - component name, default ''
    // }
  },
  getters: {
    getUser: (state) => {
      // returns the user object as set from backend
      return state.user;
    },
    loggedIn: (state) => {
      // returns true or false
      if (state.status === "success") {
        return true;
      } else {
        return false;
      }
    },
    getAllErrors: (state) => {
      // returns an array of all errors
      // used to display error messages in App.vue
      return state.errors;
    },
  },
  mutations: {
    auth_request(state) {
      // setting the login status during the login process
      state.status = "loading";
    },
    auth_success(state, payload) {
      // used in login process
      state.status = "success";
      state.token = payload.token;
      state.user = payload.user;
    },
    auth_error(state) {
      // used in login process
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
    registerError(state, payload) {
      // registers a new error
      // payload either string as error message or object, see states
      var error = {};
      if (typeof payload === String) {
        error = {
          msg: payload,
          component: "",
        };
      } else {
        error = {
          msg: payload.message,
          component: payload.component,
        };
      }
      state.errors.push(error);
    },
    removeError(state, index) {
      // removes errors by array index; used in ErrorMessage.vue to dismiss not only the error but remove it
      state.errors.splice(index, 1);
    },
    clearErrors(state, componentName = "") {
      // use with caution when component = ''
      // otherwise to clear all errors of a component, e.g. 'LoginProcess'
      state.errors = state.errors.filter(
        (e) => !(e.component === componentName)
      );
    },
  },
  actions: {
    async login({ commit }, user) {
      // the login process
      commit("auth_request");
      commit("clearErrors", "loginProcess");
      // create form body for oauth2 login scheme
      var formBody = [];
      for (var property in user) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(user[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      try {
        // commit to backend:
        const response = await fetch(Settings.coreAPI + "auth/token/", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formBody,
        });

        const status = response.status;
        const data = await response.json();

        // in case of success:
        if (status === 200) {
          // success!
          let token = {
            access_token: data.access_token,
            token_type: data.token_type,
          };
          localStorage.setItem("access_token", token["access_token"]);
          localStorage.setItem("token_type", token["token_type"]);
          localStorage.setItem("loginTime", Date.now());

          // user = getters.getUser

          const userRequest = await fetch(Settings.coreAPI + "users/me", {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Authorization:
                localStorage.token_type + " " + localStorage.access_token,
            },
          });
          const userFromDB = await userRequest.json();
          console.log(userFromDB);

          commit("auth_success", { token: token, user: userFromDB });

          return true;
        } else if (status === 400) {
          commit("auth_error");
          commit("registerError", {
            message: "Could not log in; wrong username or password",
            component: "loginProcess",
          });
          // throw "Could not log in; wrong username or password";
        } else {
          console.error(status, data);
          commit("auth_error");
          commit("registerError", {
            message: "error " + status + " please try again later",
            component: "loginProcess",
          });
          // throw "error " + status + " please try again later";
        }
      } catch (error) {
        console.error(error);
        commit("auth_error");
        commit("registerError", {
          message: "server error while logging in; please try again later",
          component: "loginProcess",
        });
        // throw "server error; please try again later";
      }
    },
    async apiCall({ commit, getters }, url, method = "GET", objectData = null) {
      // generalised apiCall to the backend, can be used for GET/POST/PUT/DELETE
      try {
        let messageData = {};
        if (method != "GET") {
          messageData = Object.assign(messageData, {
            method: method,
          });
        } else if (getters.isLoggedIn()) {
          messageData = Object.assign(messageData, {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Authorization:
                localStorage.token_type + " " + localStorage.access_token,
            },
          });
        }
        if (objectData && method != "GET") {
          messageData = Object.assign(messageData, {
            body: JSON.stringify(objectData),
          });
        }

        // console.log(messageData);

        const response = await fetch(Settings.backend + url, messageData);

        //const data = await response.json()
        if (response.status === 200) {
          //console.log(response.json())
          let returnValue = response.json();
          // console.log(returnValue)
          return returnValue;
        } else if (response.status === 401) {
          commit("logout");
          commit("registerError", {
            message:
              "You are not logged in or don't have permission for this function",
            component: "APIcall",
          });
        } else {
          throw (
            "Error " +
            response.status +
            ' Could not perform API call for: url="' +
            url +
            '", method="' +
            method +
            '", data="' +
            JSON.stringify(objectData) +
            '".'
          );
        }
      } catch (error) {
        console.error(error);
        commit("registerError", {
          message: "APIcall produced an error: " + error,
          component: "APIcall",
        });
      }
    },
  },
  modules: {},
});
