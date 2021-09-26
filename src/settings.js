export default {
  name: "Settings",
  author: "Jakob R. Müller",
  authorEmail: "jakob.muller@chalmers.se",
  githubLink: "https://github.com/mujakob/sedFrontend",
  version: 0.2,
  backend: "http://localhost:8000/api/",
  // coreAPI: "http://localhost:8000/api/core/",
  imageHost: "@/assets/img/",
  apps: [           // which apps are used in this frontend
    "MOD.EFM",      // Further data will be fetched from the backend via store!     
  ],  
  accessLevel(lvl) {    // to translate the accessLevel ID into a human readable string
    const lvls = [
        'none',
        'READONLY',
        'EDITOR',
        'ADMIN',
        'OWNER',
    ]
    return lvls[lvl]
  },
  
  
};
