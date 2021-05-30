import Settings from '@/settings'
import { logout, isLoggedIn } from '@/router'
import settings from './settings';
import store from '@/store'


async function apiCall(url, method = "GET", objectData = null) {
    // treeData:
    // { name: 'string', description: 'string}
    try {
      let messageData = {};
      if (method != "GET") {
        messageData = Object.assign(messageData, {
          method: method,
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization:
              localStorage.token_type + " " + localStorage.access_token
          }
        });
      } else if(isLoggedIn()) {
        messageData = Object.assign(messageData, {
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
            Authorization:
              localStorage.token_type + " " + localStorage.access_token
          }
        });
      }
      if (objectData && method != "GET") {
        messageData = Object.assign(messageData, {
          body: JSON.stringify(objectData)
        });
      }
  
      // console.log(messageData);
  
      const response = await fetch(Settings.backend + url, messageData);
  
  
      //const data = await response.json()
      if (response.status === 200) {
        //console.log(response.json())
        let returnValue = response.json()
        // console.log(returnValue)
        return returnValue
  
      } else if (response.status === 401) {
        logout()
        throw "You are not logged in or don't have permission for this function";
      } else {
        throw "Error " +
          response.status +
          ' Could not perform API call for: url="' +
          url +
          '", method="' +
          method +
          '", data="' +
          JSON.stringify(objectData) +
          '".';
      }
    } catch (error) {
      console.error(error);
      throw "Could not perform API call: " + error;
    }
  }

export default {
    userLoggedIn() {
        return isLoggedIn()
    },

    async getCurrentUser() {

        return apiCall(settings.coreAPI + 'users/me')
    },

    async loginToBackend(username, password) {
        // const formdata = new FormData()
        // formdata.append('username', username)
        // formdata.append('password', password)
        // console.log(user)
        // const { username, password } = this
        
        console.log(store.mutations.auth_request())

        let user = { username: username, password: password };
    
        var formBody = [];
        for (var property in user) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(user[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
    
        try {
          const response = await fetch(Settings.coreAPI + "auth/token/", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: formBody
          });
    
          const status = response.status;
          const data = await response.json();
    
          if (status === 200) {
            // success!
            let token = {
              access_token: data.access_token,
              token_type: data.token_type
            };
            localStorage.setItem("access_token", token["access_token"]);
            localStorage.setItem("token_type", token["token_type"]);
            localStorage.setItem("loginTime", Date.now());

            user = this.getCurrentUser()

            store.mutations.auth_success(token, user)

            return "logged in";
          } else if (status === 401) {
            store.mutations.auth_error()
            throw "Could not log in; wrong username or password";
          } else {
            console.error(status, data);
            store.mutations.auth_error()
            throw "error " + status + " please try again later";
          }
        } catch (error) {
          console.error(error);
          this.$store.mutations.auth_error()
          throw "server error; please try again later";
        }
      },
    
    logout() {
        this.$store.mutations.logout()
        logout()
    }
}