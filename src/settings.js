export default {
  name: "Settings",
  author: "Jakob R. Müller",
  authorEmail: "jakob.muller@chalmers.se",
  githubLink: "https://github.com/mujakob/sedFrontend",
  version: 0.3,
  backend: "http://localhost:8000/api/",
  // coreAPI: "http://localhost:8000/api/core/",
  imageHost: "@/assets/img/",
  apps: [
    // which apps are used in this frontend
    "MOD.EFM", // Further data will be fetched from the backend via store!
  ],
  accessLevel(lvl) {
    // to translate the accessLevel ID into a human readable string
    const lvls = [
      "none", // 0
      "READONLY", // 1
      "EDITOR", // 2
      "ADMIN", // 3
      "OWNER", // 4
    ];
    return lvls[lvl];
  },
};
