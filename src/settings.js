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
  efmObjects: {
    ds: {
      string: 'Design Solution',
      short: 'DS',
      getURL: 'ds/{id}',
      postURL: 'ds/new',
      putURL: 'ds/{id}',
      deleteURL: 'ds/{id}',
      postMutation: 'newDS',
      putMutation: 'editDS',
      deleteMutation: 'deleteDS',
      requiredFields: {
        'name': 'name',       // API : fieldName
        'isbID': 'parentID',
      },
      optionalFields: {
        'description': 'description',
        'treeID': 'treeID',
        'is_top_level_DS': 'is_top_level_DS',
      },
      children: 'requires_functions_id',
    },
    fr: {
      string: 'Functional Requirement',
      short: 'FR',
      getURL: 'fr/{id}',
      postURL: 'fr/new',
      putURL: 'fr/{id}',
      deleteURL: 'fr/{id}',
      postMutation: 'newFR',
      putMutation: 'editFR',
      deleteMutation: 'deleteFR',
      requiredFields: {
        'name': 'name',       // API : fieldName
        'rfID': 'parentID',
      },
      optionalFields: {
        'description': 'description',
        'treeID': 'treeID',
      },
      children: 'is_solved_by_id',
    },
    tree: {
      string: 'EFM tree',
      short: 'Tree',
      getURL: 'trees/{id}',
      postURL: 'trees/',
      putURL: 'trees/{id}',
      deleteURL: 'trees/{id}',
      postMutation: 'newTree',
      putMutation: 'editTree',
      deleteMutation: 'deleteTree',
      requiredFields: {
        'name': 'name',       // API : fieldName
      },
      optionalFields: {
        'description': 'description',
      }
    },
  }
  
};
