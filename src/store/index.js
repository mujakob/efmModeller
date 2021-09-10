import Vue from "vue";
import Vuex from "vuex";

import settings from "@/settings";

Vue.use(Vuex);

const efmStore = {
  namespaced: true,
  state: {
    treeList: [], // list of all tree objects
    treeInfo: null, // header info of open tree
    ds: [], // list of all DS of open tree
    // "name": "The testing tree",
    // "description": "Top-level DS",
    // "isbID": null,
    // "treeID": 3,
    // "is_top_level_DS": true,
    // "id": 15,
    // "requires_functions_id": [
    //   7,
    //   8,
    //   9
    // ],
    // "interacts_with_id": [],
    // "design_parameter_id": []
    fr: [], // list of all FR of open tree
    c: [], // list of all C of open tree
    iw: [], // list of all iw of open tree
    concepts: [], // list of instances of open tree
    //////////////
    efmViewMenu: {
      showConceptsPane: false,
      showObjectInfoPane: false,
    },
    efmObjects: {
      ds: {
        string: "Design Solution",
        objType: "ds",
        short: "DS",
        getURL: "ds/{id}",
        postURL: "ds/new",
        putURL: "ds/{id}",
        deleteURL: "ds/{id}",
        postMutation: "newDS",
        putMutation: "editDS",
        deleteMutation: "deleteDS",
        requiredFields: {
          name: "name", // API : fieldName
          isbID: "parentID",
        },
        optionalFields: {
          description: "description",
          treeID: "treeID",
          is_top_level_DS: "is_top_level_DS",
        },
        children: [
          {
            list: "requires_functions_id",
            type: "fr",
          },
          {
            list: "interacts_with_id",
            type: "iw",
          },
          // {    // Not implemented yet!
          //   list: 'design_parameter_id',
          //   type: 'dp'
          // },
        ],
        parentType: 'fr',
        newParentUrl: 'ds/{id}/isb',
      },
      fr: {
        string: "Functional Requirement",
        objType: "fr",
        short: "FR",
        getURL: "fr/{id}",
        postURL: "fr/new",
        putURL: "fr/{id}",
        deleteURL: "fr/{id}",
        postMutation: "newFR",
        putMutation: "editFR",
        deleteMutation: "deleteFR",
        requiredFields: {
          name: "name", // API : fieldName
          rfID: "parentID",
        },
        optionalFields: {
          description: "description",
          treeID: "treeID",
        },
        children: [
          {
            list: "is_solved_by_id",
            type: "ds",
          },
        ],
        parentType: 'ds',
        newParentUrl: 'fr/{id}/rf',
      },
      tree: {
        string: "EFM tree",
        objType: "tree",
        short: "Tree",
        getURL: "trees/{id}",
        postURL: "trees/",
        putURL: "trees/{id}",
        deleteURL: "trees/{id}",
        postMutation: "newTree",
        putMutation: "editTree",
        deleteMutation: "deleteTree",
        requiredFields: {
          name: "name", // API : fieldName
        },
        optionalFields: {
          description: "description",
        },
        children: [
          {
            list: "topLvlDSid",
            type: "ds",
          },
        ],
      },
    },
    // the following two are for GUI selection of new parents etc
    objectsToSelect: [], // list of efm objects
    selectedObject: null,
    objectWaitingForNewParent: null, // {type, id}
  },
  getters: {
    // treeList
    allTrees: (state) => {
      return state.treeList;
    },
    // tree info
    treeInfo: (state) => {
      return state.treeInfo;
    },
    // getters for single object by ID
    dsByID: (state) => (id) => {
      return state.ds.find((ds) => ds.id == id);
    },
    frByID: (state) => (id) => {
      return state.fr.find((ds) => ds.id == id);
    },
    cByID: (state) => (id) => {
      return state.c.find((ds) => ds.id == id);
    },
    iwByID: (state) => (id) => {
      return state.iw.find((ds) => ds.id == id);
    },
    EFMobjectInfo:
      (state) =>
      (type, id = null) => {
        // returns info about EFM Object
        let objInfo = state.efmObjects[type];
        // if id is set, it already adapts all URLs and other info which is ID sensitive:
        if (id) {
          for (let i in objInfo) {
            if (typeof objInfo[i] == "string") {
              objInfo[i] = objInfo[i].replace("{id}", id);
            }
          }
        }
        return objInfo;
      },
    getEFMobjectByID: (state) => (type, id) => {
      return state[type].find((obj) => obj.id == id);
    },
    getEFMobjectsByType: (state) => (type) => {
      return state[type]
    },
    efmObjectChildren: (state, getters) => (type, id) => {
      // returns list with type, id of each childobject of an efm object
      // needed for state consistency checks with the backend
      // console.log('getting all children of ' + type + id)
      const objType = getters.EFMobjectInfo(type, id);
      const theObject = getters.getEFMobjectByID(type, id);

      let allChildrenList = [];

      for (let c of objType.children) {
        // console.log('collecting children of type ' + c.type + ' for ' + type + id)
        // c is like {type: 'ds', list: 'is_solved_by_id'}
        if (Array.isArray(theObject[c.list])) {
          // here we iterate through the objects children list
          for (let cc of theObject[c.list]) {
            // c.list contains IDs when backend is set correctly
            
            // console.log('found child ' + c.type + cc + ' of ' + type + id)
            allChildrenList.push({type: c.type, id: cc});
          }
        } else {
          // in case that c.list is no list but just a single value, e.g. topLvlDSid
          // console.log('found child' + c.type + c.list + ' of ' + type + id)
          allChildrenList.push({type: c.type, id: c.list});
        }
      }
      return allChildrenList;
    },
    efmObjectAllChildrenRecursive: (state, getters) => (type, id) => {
      // console.log('getting all children (recursive) of ' + type + id)
      let allChildrenList = getters.efmObjectChildren(type, id)
      // console.log('allChildrenList' + type + id)
      // console.log(allChildrenList)

      let returnChildrenList = []
      
      for (let c of allChildrenList) {

        // console.log('recursing one level deper onto ' + c.type + c.id)
        let recursiveChildren = getters.efmObjectAllChildrenRecursive(c.type, c.id)
        returnChildrenList = returnChildrenList.concat(recursiveChildren)
      }

      returnChildrenList = returnChildrenList.concat(allChildrenList)

      // console.log('returnChilrenList' + type + id)
      // console.log(returnChildrenList)
      return returnChildrenList
    },
    efmObjectPossibleParents: (state, getters) => (type, id) => {
      // returns a list of possible parent objects,
      // that is all objects of other type ( DS <> FR ) which are not below in the tree
      // returns list of objects
      // console.log('getting all possible parents of ' + type + id)
    
      const objInfo = getters.EFMobjectInfo(type, id)
      
      let allPossibleParents = getters.getEFMobjectsByType(objInfo.parentType)

      let allChildrenID = getters.efmObjectAllChildrenRecursive(type, id)

      let allChildren = [] // rewrite array with objects instead of type:id pairs
      for (let c of allChildrenID) {
        // c[0] = type, c[1] = id
        if (c.type == objInfo.parentType) { // filter to only include parentType
          allChildren.push(getters.getEFMobjectByID(c.type, c.id))
        } 
      }
      // console.log('lists in possibleparent function')
      // console.log(allChildrenID)
      // console.log(allChildren)
      // console.log(allPossibleParents)
      allPossibleParents = allPossibleParents.filter(p => !allChildren.includes(p))
      
      return allPossibleParents

    },
    // for GUI based selection of new parents ect
    objectIsToBeSelected: (state, getters) => (type, id) => {
      // returns true/false whether type, id is in the array objectsToSelect
      // console.log('objectIsToBeSelected: ' + type + id)
      const theObj = getters.getEFMobjectByID(type, id)
      const isInSelectedObjects = state.objectsToSelect.find(o => o == theObj)
      // console.log(isInSelectedObjects)
      // console.log(state.objectsToSelect)
      if (isInSelectedObjects) {
        return true
      } else {
        return false
      }
    },
    theSelectedObject: (state) => {
      return state.selectedObject
    },
    whoIsWaitingForParent: (state) => {
      return state.objectWaitingForNewParent
    },

    // Concepts
    allConcepts: (state) => {
      return state.concepts;
    },
    conceptByID: (state) => (id) => {
      return state.concepts.find((c) => c.id == id);
    },
  },
  mutations: {
    setTreeList(state, payload) {
      // sets the list of all trees in state
      state.treeList = payload;
    },
    setAllEfmObjects(state, theTree) {
      // payload is a tree data object as returned by efm/trees/{id}/data
      state.treeInfo = {
        name: theTree.name,
        description: theTree.description,
        id: theTree.id,
        topLvlDSid: theTree.topLvlDSid,
      };
      state.ds = theTree.ds;
      state.fr = theTree.fr;
      state.c = theTree.c;
      state.iw = theTree.iw;
    },
    setAllConcepts(state, concepts) {
      state.concepts = concepts;
    },

    // new EFM Objects
    newTree(state, data) {
      // simply pushes the new object into the store array
      state.treeList.push(data);
    },
    newDS(state, data) {
      // simply pushes the new object into the store array
      state.ds.push(data);
    },
    newFR(state, data) {
      state.fr.push(data);
    },
    newIW(state, data) {
      state.iw.push(data);
    },
    newC(state, data) {
      state.c.push(data);
    },

    // edit EFM objects
    editTree(state, data) {
      // finds the object via data.id and substitutes it with data
      let index = state.treeList.indexOf(
        state.treeList.find((obj) => obj.id == data.id)
      );

      if (index != -1) {
        state.treeList[index] = data;
      }
    },
    editDS(state, data) {
      // finds the object via data.id and substitutes it with data
      let index = state.ds.indexOf(state.ds.find((obj) => obj.id == data.id));
      console.log("editDS index " + String(index));

      if (index != -1) {
        // console.log('please compare')
        // console.log(state.ds[index])
        // console.log(data)
        state.ds[index] = data;
        console.log(state.ds[index]);
      }
    },
    editFR(state, data) {
      let index = state.fr.indexOf(state.fr.find((obj) => obj.id == data.id));

      if (index != -1) {
        state.fr[index] = data;
      }
    },
    editIW(state, data) {
      let index = state.iw.indexOf(state.iw.find((obj) => obj.id == data.id));

      if (index != -1) {
        state.iw[index] = data;
      }
    },
    editC(state, data) {
      let index = state.c.indexOf(state.c.find((obj) => obj.id == data.id));

      if (index != -1) {
        state.c[index] = data;
      }
    },

    // delete EFM objects
    deleteDS(state, id) {
      // filters the state to _not_ contain the object with id
      state.ds = state.ds.filter((obj) => obj.id != id);
    },
    deleteFR(state, id) {
      state.fr = state.fr.filter((obj) => obj.id != id);
    },
    deleteIW(state, id) {
      state.iw = state.iw.filter((obj) => obj.id != id);
    },
    deleteC(state, id) {
      state.c = state.c.filter((obj) => obj.id != id);
    },

    // gui based selections
    setObjectsToSelect(state, objectList) {
      // sets the list of to be selected objects to objectList
      // objectList must be  [{type: type, id:id}, ...]
      state.objectsToSelect = objectList
    },
    objectIsSelected(state, object) {
      // sets the selected object to object
      // object is {type, id} pair
      state.selectedObject = object
    },
    setWaitingForNewParent(state, object) {
      // object= {type, id}
      state.objectWaitingForNewParent = object
    }
  },
  actions: {
    async getTreeList({ commit, dispatch }) {
      let allTrees = await dispatch(
        "apiCall",
        {
          url: "efm/trees",
          method: "GET",
        },
        { root: true }
      );
      // in case error, so it's not "undefined" but empty array
      if (!allTrees) {
        allTrees = [];
      }
      commit("setTreeList", allTrees);
      return allTrees;
    },
    async getTree({ commit, dispatch }, { treeID }) {
      let theTree = await dispatch(
        "apiCall",
        {
          url: "efm/trees/" + treeID + "/data",
          method: "GET",
        },
        { root: true }
      );
      // in case error, so it's not "undefined" but empty array
      if (!theTree) {
        theTree = [];
      } else {
        commit("setAllEfmObjects", theTree);
        commit("goodNews", 'Loaded all elements of "' + theTree.name + '".', {
          root: true,
        });
      }
    },
    async updateTree({ getters, commit, dispatch }) {
      // updates all current tree data via /trees/id/data
      // actually only wrapts getTree with the current tree's ID
      let treeID = getters.treeInfo.id;
      console.log("ffs: " + treeID);
      dispatch("getTree", { treeID });
      commit("goodNews", "updated all tree items", { root: true });
    },
    async getConcepts({ getters, commit, dispatch }) {
      const theTree = getters.treeInfo;
      let allConcepts = await dispatch(
        "apiCall",
        {
          url: "efm/trees/" + theTree.id + "/instantiate",
          method: "GET",
        },
        { root: true }
      );
      // in case error, so it's not "undefined" but empty array
      if (!allConcepts) {
        allConcepts = [];
      } else {
        commit("setAllConcepts", allConcepts);
        commit("goodNews", 'Loaded all concepts of "' + theTree.name + '".', {
          root: true,
        });
      }
    },

    async newEFMobject({ getters, commit, dispatch }, { type, data }) {
      // submits "data" to the right backend point depending on efmObjects / type
      // posts the return value to local storage
      // returns new object or null (if error)

      const objType = getters.EFMobjectInfo(type);

      var newObject = null;

      try {
        console.log('api call "newEFMobject"');
        console.log("objecttype: " + objType.short);
        console.log(data);
        newObject = await dispatch(
          "apiCall",
          {
            url: "efm/" + objType.postURL,
            method: "POST",
            objectData: data,
          },
          { root: true }
        );
      } catch (e) {
        return false;
      }
      if (newObject) {
        // commit(objType.postMutation, newObject);
        commit(
          "goodNews",
          {
            message: "Created new " + objType.string + ": " + newObject.name,
            timeout: 3000,
          },
          { root: true }
        );

        // update all tree data, since doing it one by one is too complicated:
        dispatch("updateTree");
        return newObject;
      } else {
        return null;
      }
    },
    async editEFMobject({ getters, commit, dispatch }, { type, data }) {
      // submits "data" to the right backend point depending on efmObjects / type
      // id for backend is taken from data.id
      // posts the return value to local storage
      // returns new object or null (if error)

      const objType = getters.EFMobjectInfo(type, data.id);

      let putURL = objType.putURL;
      // replace {id} in url with data.id
      putURL = putURL.replace("{id}", data.id);
      console.log("putURL: " + putURL);

      let newObjectData = await dispatch(
        "apiCall",
        {
          url: "efm/" + objType.putURL,
          method: "PUT",
          objectData: data,
        },
        { root: true }
      );

      if (newObjectData) {
        // console.log('WE HAVE DATA')
        // console.log(objType.putMutation, newObjectData)
        // commit(objType.putMutation, newObjectData);
        commit(
          "goodNews",
          {
            message: "Edited " + objType.string + ": " + newObjectData.name,
            timeout: 3000,
          },
          { root: true }
        );

        // update all tree data, since doing it one by one is too complicated:
        dispatch("updateTree");
      }
      return newObjectData;
    },
    async deleteEFMobject({ getters, commit, dispatch }, { type, id }) {
      // deletes object from backend depending on efmObjects / type
      // when success, removes from state
      // returns true/false based on success

      const objType = getters.EFMobjectInfo(type, id);

      let deletion = await dispatch(
        "apiCall",
        {
          url: "efm/" + objType.deleteURL,
          method: "DELETE",
        },
        { root: true }
      );
      console.log(deletion);
      if (deletion) {
        // commit(objType.deleteMutation, id);
        commit(
          "goodNews",
          {
            message: "Deleted " + objType.string,
            timeout: 3000,
          },
          { root: true }
        );
        // // and we need to check all the children too, since they probably need to be removed as well
        // for (let child of getters.efmObjectChildren(type, id)) {
        //   // child should be [type, id]
        //   dispatch('updateEFMobject', {type: child[0], id: child[1]})
        // }

        // update all tree data, since doing it one by one is too complicated:
        dispatch("updateTree");
        return true;
      }
    },
    async updateEFMobject({ getters, commit, dispatch }, { type, id }) {
      // fetches the info of a EFM object and updates state
      // deletes if 404
      // recursively updates children
      // mainly used in edit and delete EFM object actions for chidlren and parents of edited/deleted objects

      const objType = getters.EFMobjectInfo(type, id);

      // let theObjectInState = getters.getEFMobjectByID(type, id)

      let theObjectFromDB = await dispatch(
        "apiCall",
        {
          url: "efm/" + objType.getURL,
          method: "GET",
        },
        { root: true }
      );

      if (theObjectFromDB === 404) {
        // type sensitive check needed here!
        // if 404 (not found, i.e. deleted) we remove from state:
        commit(objType.deleteMutation, id);
        // and we need to check all the children too, since they probably need to be removed as well
        for (let child of getters.efmObjectChildren(type, id)) {
          // child should be [type, id]
          dispatch("updateEFMobject", { type: child[0], id: child[1] });
        }
      } else if (theObjectFromDB) {
        // if we get a return we just update it in state:
        commit(objType.putMutation, theObjectFromDB);
      }
    },

    async setNewParentFromGui({getters, commit, dispatch}, {newParent}) {

      if (getters.whoIsWaitingForParent) {
        console.log('setting new parent via GUI')

        // fetch who is waiting for the parent
        const theObj = getters.whoIsWaitingForParent

        // fetch object info for that
        const objectInfo = getters.EFMobjectInfo(theObj.type, theObj.id)
        const parentType = objectInfo.parentType

        console.log('setting new parents for' + theObj.type + theObj.id + ', parentType: ' + parentType + ', new parent: ' + newParent.name )
        
        let submitData = {query:'newParentID', value: newParent.id}
        
        let newParentUrl = objectInfo.newParentUrl
        // dispatch to backend  
        let newObjData = await dispatch(
          "apiCall",
          {
            url: "efm/" + newParentUrl,
            query: [submitData],
            method: "PUT",
          },
          { root: true }
        );

        // and we have to reset all variables:
        commit('setWaitingForNewParent', null)
        commit('objectIsSelected', null)

        // update all tree data, since doing it one by one is too complicated:
        dispatch("updateTree");
        

        return newObjData
      }
    }
  },
  modules: {},
};

const projectStore = {
  state: {
    projects: [],
  },
  getters: {
    projectList: (state) => {
      return state.projects;
    },
    getProjectByID: (state) => (id) => {
      return state.projects.find((p) => p.id == id);
    },
  },
  mutations: {
    addAllProjects(state, payload) {
      state.projects = payload;
    },
    addProject(state, payload) {
      state.projects.push(payload);
    },
    deleteProject(state, id) {
      state.projects = state.projects.filter((p) => p.id != id);
    },
    updateProjectName(state, payload) {
      let index = state.projects.indexOf(
        state.projects.find((v) => v.key == payload.key)
      );

      if (index != -1) {
        state.projects[index].name = payload.name;
      }
    },
  },
  actions: {
    async fetchProjects({ commit, dispatch }) {
      // gets all projects (of current user) from API and stores them into store

      // *** TODO *** only fetches 100 projects so far; needs pagination
      let projects = await dispatch(
        "apiCall",
        {
          url: "core/projects/",
          method: "GET",
          query: [
            {
              query: "segment_length",
              value: "100",
            },
            {
              query: "index",
              value: "0",
            },
          ],
        },
        { root: true }
      );
      // in case error, so it's not "undefined" but empty array
      if (!projects) {
        projects = [];
      }
      // console.log(projects)
      commit("addAllProjects", projects);
    },
    async newProject({ commit, dispatch }, { projectData }) {
      var newProject = null;
      // ***TODO***  doesn't fit API yet
      // *** need to clear up API definitions first

      // to prevent 422 we rewrite picdata to fit API
      var projectDataFormatted = {
        name: projectData.name,
        // exif: picData.exif
      };

      newProject = await dispatch(
        "apiCall",
        {
          url: "core/projects/",
          method: "POST",
          objectData: projectDataFormatted,
        },
        { root: true }
      );

      if (newProject) {
        commit("createNewPicture", newProject);
        commit(
          "goodNews",
          {
            message: "Created new project " + newProject.name,
            timeout: 3000,
          },
          { root: true }
        );
      }

      return newProject;
    },
    async editProjectName({ commit, dispatch }, { key, projectName }) {
      // key needs to be submitted seperately to the function bc picdata does not necessarily include it!

      let success = await dispatch(
        "apiCall",
        {
          url: "core/projects/" + key + "/name/",
          method: "PUT",
          query: [{ query: "name", value: projectName }],
        },
        { root: true }
      );

      if (success) {
        commit("updateProjectName", { key: key, name: projectName });
        commit(
          "goodNews",
          {
            message: "Edited project name to " + projectName,
            timeout: 3000,
          },
          { root: true }
        );
      }
      return success;
    },
    async deleteProject({ commit, dispatch }, { picKey }) {
      console.log("key to delete: " + picKey);
      let deletion = await dispatch(
        "apiCall",
        {
          url: "images/" + picKey,
          method: "DELETE",
        },
        { root: true }
      );
      if (deletion) {
        commit("deletePicture", picKey);
        commit(
          "goodNews",
          {
            message: "Deleted picture ",
            timeout: 3000,
          },
          { root: true }
        );
        return true;
      }
    },
  },
};

export default new Vuex.Store({
  namspaced: true,
  state: {
    status: "", // login status
    token: localStorage.getItem("token") || "", // authentication token
    user: {}, // user object from API
    // {
    //   "id": 1,
    //   "username": "admin",
    //   "email": null,
    //   "full_name": null,
    //   "disabled": null,
    //   "scopes": "admin"
    // }
    errors: [], // for centralised error handling
    // {
    //   msg: String,
    //   component: string - component name, default ''
    // }
    snack: null, // for centralised "good news" popup
    // {
    //   message: string,
    //   timeout: Int,
    // }
    loading: false, // bool for login loading process, should be reworked
    APIloaded: false, // indicates whether the backend data has been loaded
    apps: [], // which apps are used in this frontend ; filled from backend based on settings
  },
  getters: {
    getUser: (state) => {
      // returns the user object as set from backend
      return state.user;
    },
    getUserScope: (state) => {
      return state.user.scopes;
    },
    loggedIn: (state) => {
      // returns true or false
      let deltaT = 30 * 60 * 1000; // time until logout

      if (state.status === "success") {
        console.log("still logged in");
        return true;
      } else if (
        // check if we have localStorage auth
        localStorage.getItem("token_type") &&
        localStorage.getItem("access_token") &&
        localStorage.getItem("loginTime") > Date.now() - deltaT
      ) {
        console.log("found local storage auth");
        return true;
      } else {
        console.log("login check failed");
        console.log(localStorage.getItem("token_type"));
        console.log(localStorage.getItem("access_token"));
        console.log(localStorage.getItem("loginTime") > Date.now() - deltaT);
        return false;
      }
    },
    getAllErrors: (state) => {
      // returns an array of all errors
      // used to display error messages in App.vue
      return state.errors;
    },
    getErrorsOfComponent: (state) => (componentName) => {
      // returns an array of all errors
      // used to display error messages in App.vue
      return state.errors.filter((e) => e.component == componentName);
    },
    allTheGoodNews: (state) => {
      return state.snack;
    },
    isLoading: (state) => {
      return state.loading;
    },
    APIloaded(state) {
      return state.APIloaded;
    },
    allApps(state) {
      return state.apps;
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
      // remove user-related objects from store:
      state.apps = [];
      state.user = null;
      localStorage.removeItem("token_type");
      localStorage.removeItem("access_token");
      console.log("logged out...");
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
          msg: payload.msg,
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
      console.log("deleting errors of " + componentName);
      state.errors = state.errors.filter((e) => e.component != componentName);
    },
    goodNews(state, payload) {
      let news = null;
      if (payload.timeout && payload.message) {
        news = payload;
      } else if (payload.message) {
        news = {
          message: payload.message,
          timeout: 3000,
        };
      } else {
        news = {
          message: payload,
          timeout: 3000,
        };
      }
      state.snack = news;
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
    },
    APIloaded(state) {
      state.APIloaded = true;
    },
    APIunload(state) {
      state.APIloaded = false;
    },
    // USER MGMT
    setUserMe(state, payload) {
      state.user = payload;
    },
    // APPS
    addAPP(state, payload) {
      state.apps.push(payload);
    },
    removeAllApps(state) {
      state.apps = [];
    },
  },
  actions: {
    async login({ commit }, user) {
      commit("startLoading"); // loading window
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
        const response = await fetch(settings.backend + "core/auth/token/", {
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

          const userRequest = await fetch(settings.backend + "users/me", {
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
              Authorization:
                localStorage.token_type + " " + localStorage.access_token,
            },
          });
          const userFromDB = await userRequest.json();
          console.log(userFromDB);

          commit("auth_success", { token: token, user: userFromDB });

          // Fetch user data
          await this.dispatch("fetchUserMe");
          // Fetch apps
          await this.dispatch("fetchApps");
          commit("stopLoading");
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
      commit("stopLoading");
    },
    async fetchUserMe({ getters, commit, dispatch }) {
      // gets the userdata and stores into store
      if (getters.loggedIn) {
        const userData = await dispatch("apiCall", {
          url: "core/users/me",
          method: "GET",
        });
        if (userData) {
          commit("setUserMe", userData);
        }
      }
    },
    async apiCall(
      { commit, getters },
      { url, query = [], method = "GET", objectData = null }
    ) {
      // generalised apiCall to the backend, can be used for GET/POST/PUT/DELETE
      commit("startLoading"); // loading icon

      console.log(url);
      console.log(method);
      console.log(objectData);

      let returnValue = false;

      try {
        ////////////////////////////////////////////////////////////
        // assembling URL
        let urlToFetch = String(settings.backend + url);
        if (query.length) {
          // console.log(query)
          urlToFetch = urlToFetch + "?";
          for (let q of query) {
            // console.log(q)
            urlToFetch = urlToFetch + q.query + "=" + q.value + "&";
          }
        }
        ////////////////////////////////////////////////////////////
        // assembling message data:
        let messageData = {};
        let messageHeader = {};
        if (getters.loggedIn) {
          // in case of logged in we want to add authorisation
          // doesn't hurt if it is not there...
          console.log("logged in, adding auth");
          messageHeader = Object.assign(messageHeader, {
            Authorization:
              localStorage.token_type + " " + localStorage.access_token,
          });
        }
        if (method != "GET") {
          // If we have another method
          messageData = Object.assign(messageData, {
            method: method,
          });
        }

        if (objectData && method != "GET") {
          // need to add content to header
          messageHeader = Object.assign(messageHeader, {
            "Content-Type": "application/json",
          });
          // need to attach body
          messageData = Object.assign(messageData, {
            body: JSON.stringify(objectData),
          });
        }

        if (messageHeader) {
          // add header if not empty
          console.log("adding hea");
          messageData = Object.assign(messageData, {
            headers: messageHeader,
          });
        }

        console.log(messageData);
        // console.log(settings.backend)
        console.log(urlToFetch);

        const response = await fetch(urlToFetch, messageData);

        //const data = await response.json()
        if (response.status === 200) {
          //console.log(response.json())
          returnValue = await response.json();
          console.log(returnValue);
          // console.log(returnValue)
          if (!returnValue) {
            // in case of e.g. deletion where there is only 200 as response
            returnValue = true;
          }
        } else if (response.status === 401) {
          // commit("logout");
          commit("registerError", {
            message:
              "You are not logged in or don't have permission for this function",
            component: "APIcall",
          });
        } else if (response.status === 404) {
          commit("registerError", {
            message: "Element couold not be found",
            component: "APIcall",
          });
          returnValue = 404; // identifier for a 404
        } else {
          commit("registerError", {
            message:
              "Error " +
              response.status +
              ' Could not perform API call for: url="' +
              url +
              '", method="' +
              method +
              '", data="' +
              JSON.stringify(objectData) +
              '".',
            component: "APIcall",
          });
        }
      } catch (error) {
        console.error(error);
        commit("registerError", {
          message: "APIcall produced an error: " + error,
          component: "APIcall",
        });
      }
      commit("stopLoading");
      return returnValue;
    },
    async fetchApps({ commit, dispatch }) {
      // Fetches the app info from the backend and stores into store.apps
      for (let a of settings.apps) {
        console.log("fetching app " + a);
        const theApp = await dispatch("apiCall", {
          url: "core/apps/" + a,
          method: "GET",
        });
        if (theApp) {
          // temporarily adding fake projects:
          theApp.projects = await this.dispatch("efm/getTreeList");
          commit("addAPP", theApp);
        }
      }
    },
  },
  modules: {
    efm: efmStore,
    project: projectStore,
  },
});
