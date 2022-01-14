# efmFrontend
Copy from @sedlab at Chalmers

Developed to work with SEDbackend [https://github.com/sed-group/sed-backend](https://github.com/sed-group/sed-backend)

An interpretation of Enhanced Function-Means modelling according to [Müller et al. 2019](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/DA70513CCF3B187DAF99FD22BC127724/S0890060419000271a.pdf/div-class-title-enhanced-function-means-modeling-supporting-design-space-exploration-div.pdf)

version 0.2

## adaptions before use:
The backend is linked in src/settings.js
Please adapt to the respective local or online version you are using:
```
    efmAPI: "http://localhost:8000/api/efm/",
    coreAPI: "http://localhost:8000/api/core/",
```
Furthermore, if you make use of images, set the respective imageHost in the same file (currently used for potential user avatar images):
```
    imageHost: "@/assets/img/",
```

## Use
The template uses vuex for user and error management, which can easily be used in your application.

### User and authentication
The vuex store contains functions to retrieve user and authentication information.
To get the current user object (as provided by the backend):
```
this.$store.getters.getUser
```
or
```
computed: {
    ...mapGetters([
        'getUser',
    ])
}
```
and using getUser as a variable, e.g.
```
{{getUser.username}}
```

Whether the user is logged in or not can be checked via the vuex getter
```
this.$store.getters.loggedIn //true or false
```

### API calls
The vuex file contains a function 
```
store.dispatch({
  type: 'apiCall',      
  url: 'your/API/call', //Settings.backend + 'url' is used inside the function!
  method: 'POST',       //default 'GET'
  objectData: {         //only for POST and PUT
      data: '...'
  }               
})
```
which should suffice for most calls for the backend (as set in settings.js).
It is set to automatically use the authentication set by the login process.


### Errormanagement
Errors are collected in the vuex store and shown through the ErrorMessage.vue component in the main App.vue file.

To set an error which is to be displayed through this mechanism use
```
this.$store.commit(
    'registerError',
    {
        message: 'This is your error message',
        component: ' optional - the component which registered the error'
    }
)
```

Errors can be removed from the error array via their display, or all errors can be cleared via 
```
this.$store.commit(
    'clearErrors',
    'componentName(optional)'
)
```
either component dependent or all of them.

## Project setup using NPM
``` 
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
