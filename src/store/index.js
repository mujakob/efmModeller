import Vue from "vue";
import Vuex from "vuex";

import settings from "@/settings";

Vue.use(Vuex);

const efmApi = "efm/";

function random_s4() {
  // returns a random 4 digit alphanumeric
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

const settingsStore = {
  state: {
    object_colors: {
      // vuetify colors
      ds: "amber",
      fr: "blue",
      iw: "grey",
      c: "deep-purple",
      iw_spatial: "blue",
      iw_energy: "yellow",
      iw_material: "green",
      iw_signal: "red",
    },
    iw_types: [
      'spatial',
      'energy',
      'material',
      'signal'
    ],
    show_editor: true,
    show_iwLines: true,
    show_constraints: true,
    treeObjectSize: 1,        // 0 small, 1 medium, 2 large
    backend_URL: localStorage.getItem("backend_url") || "http://localhost:8000/api/",
    color_options: [
      {
        color_name: 'blue-yellow',
        colors: {
          ds: "amber",
          fr: "blue",
          iw: "grey",
          c: "deep-purple",
          iw_spatial: "blue",
          iw_energy: "yellow",
          iw_material: "green",
          iw_signal: "red",
        },
      },
      {
        color_name: 'black-white',
        colors: {
          ds: "grey darken-2",
          fr: "blue-grey lighten-4",
          iw: "white",
          c: "grey",
          iw_spatial: "grey",
          iw_energy: "grey",
          iw_material: "grey",
          iw_signal: "grey",
        },
      },
      {
        color_name: 'green',
        colors: {
          ds: "green",
          fr: "teal",
          iw: "light-green",
          c: "lime",
          iw_spatial: "red",
          iw_energy: "pink",
          iw_material: "orange",
          iw_signal: "yellow",
        },
      },
    ]
  },
  getters: {
    efmObjectColor: (state) => (objType) => {
      return state.object_colors[objType];
    },
    iwTypes: (state) => {
      return state.iw_types
    },
    showEditor: (state) => {
      return state.show_editor
    },
    backendURL: (state) => {
        return state.backend_URL
    },
    treeObjectSize: (state) => {
      return state.treeObjectSize
    },
    showConstraints: (state) => {
      // automatic false when treeObjectSize == 0 (small)
      if (state.treeObjectSize) {
        return state.show_constraints
      } else {
        return false
      }
    },
    showIW: (state) => {
      return state.show_iwLines
    },
    colorOptions: (state) => {
      return state.color_options
    }
  },
  mutations: {
    setEditorVisibility(state, editorState) {
      state.show_editor = editorState 
    },
    setBackendUrl(state, url) {
      localStorage.setItem('backend_url', url)
      state.backend_URL = url
    },
    setTreeObjectSize(state, value) {
      state.treeObjectSize = value
    },
    setConstraintVisibility(state, showC) {
      state.show_constraints = showC
    },
    setIWvisibility(state, showIW) {
      state.show_iwLines = showIW
    },
    setNewColorPattern(state, patternName) {
      let pattern = state.color_options.find(cs => cs.color_name == patternName)
      console.log(patternName, pattern)
      if (pattern.colors) {
        state.object_colors = pattern.colors
      }
    },
  },
  actions: {},
  modules: {},
};

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
    dp: [], // list of all design parameters
    fp: [], // list of all function parameters
    bp: [], // list of all behaviour parameters
    pc: [], // list of all parameter constraints
    params: [],
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
          isb_id: "parentID",
        },
        optionalFields: {
          description: "description",
          tree_id: "tree_id",
          is_top_level_DS: "is_top_level_ds",
        },
        children: {
          // list: "requires_functions_id",
          type: "fr",
          id_string: 'rf_id'
        },
        childrenString: 'requires functions',
        parentType: "fr",
        parentID: "isb_id",
        parentString: "solves function",
        newParentUrl: "ds/{id}/isb",
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
          rf_id: "parentID",
        },
        optionalFields: {
          description: "description",
          tree_id: "tree_id",
        },
        children: {
          // list: "is_solved_by_id",
          type: "ds",
          id_string: 'isb_id'
        },
        childrenString: 'is solved by',
        parentType: "ds",
        parentID: "rf_id",
        parentString: "is required by",
        newParentUrl: "fr/{id}/rf",
      },
      iw: {
        string: "interacts with",
        objType: "iw",
        short: "iw",
        getURL: "iw/{id}",
        postURL: "iw/new",
        putURL: "iw/{id}",
        deleteURL: "iw/{id}",
        postMutation: "newIW",
        putMutation: "editIW",
        deleteMutation: "deleteIW",
        requiredFields: {
        },
        optionalFields: {
          iw_type: "iw_type",
          description: "description",
        },
        children: {
          type: "ds",
          list: "to_ds_id",
        },
        childrenString: 'interacts with (to)',
        parentType: "ds",
        parentID: "from_ds_id",
        parentString: "interacts with (from)",
        // newParentUrl: 'fr/{id}/rf',
      },
      c: {
        string: "constraint",
        objType: "c",
        short: "C",
        getURL: "c/{id}",
        postURL: "c/new",
        putURL: "c/{id}",
        deleteURL: "c/{id}",
        postMutation: "newC",
        putMutation: "editC",
        deleteMutation: "deleteC",
        requiredFields: {
          name: "name", // API : fieldName
          icb_id: "parentID",
        },
        optionalFields: {
          description: "description",
        },
        children: {
          type: 'pc',
          id_string: 'constraint_id',
        },
        childrenString: 'parameter constrained',
        parentType: "ds",
        parentID: "icb_id",
        parentString: "constrains",
        newParentUrl: 'c/{id}/icb',
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
        children: {
          list: "top_level_ds_id",
          type: "ds",
          id_string: 'tree_id'
        },
      },
      // PARAMETERS:
      dp: { // designparameter
        string: "Design Parameter",
        objType: "dp",
        short: "DP",
        getURL: "dp/{id}",
        postURL: "dp/new",
        putURL: "dp/{id}",
        deleteURL: "dp/{id}",
        requiredFields: {
          name: "name", // API : fieldName
          ds_id: "parentID",
        },
        optionalFields: {
          value: "value",
          equation: "equation",
        },
        children: null,
        childrenString: '',
        parentType: "ds",
        parentID: "ds_id",
        parentString: "is owned by",
        // newParentUrl: "ds/{id}/isb",
      },
      fp: { // functionparameter
        string: "Function Parameter",
        objType: "fp",
        short: "FP",
        getURL: "fp/{id}",
        postURL: "fp/new",
        putURL: "fp/{id}",
        deleteURL: "fp/{id}",
        requiredFields: {
          name: "name", // API : fieldName
          fr_id: "parentID",
        },
        optionalFields: {
          value: "value",
          equation: "equation",
        },
        children: null,
        childrenString: '',
        parentType: "fr",
        parentID: "fr_id",
        parentString: "is owned by",
        // newParentUrl: "ds/{id}/isb",
      },
      bp: { // behaviourparameter
        string: "Behaviour Parameter",
        objType: "bp",
        short: "BP",
        getURL: "bp/{id}",
        postURL: "bp/new",
        putURL: "bp/{id}",
        deleteURL: "bp/{id}",
        requiredFields: {
          name: "name", // API : fieldName
          ds_id: "parentID",
        },
        optionalFields: {
          value: "value",
          equation: "equation",
        },
        children: null,
        childrenString: '',
        parentType: "ds",
        parentID: "ds_id",
        parentString: "is owned by",
        // newParentUrl: "ds/{id}/isb",
      },
      pc: { // behaviourparameter
        string: "Parameter Constraint",
        objType: "pc",
        short: "PC",
        getURL: "pc/{id}",
        postURL: "{parent_type}/{parent_id}/new",
        putURL: "pc/{id}",
        deleteURL: "pc/{id}",
        requiredFields: {
        },
        optionalFields: {
          upper_limit: "upper limit",
          lower_limit: "lower_limit",
          value_set: "value set",
          fixed: "fixed value",
        },
        children: null,
        childrenString: '',
        parentType: "c",
        parentID: "constraint_id",
        parentString: "is owned by",
        // newParentUrl: "ds/{id}/isb",
      },
    },
    // the following two are for GUI selection of new parents etc
    objectsToSelect: [], // list of efm objects
    selectedObject: null,
    objectWaitingForNewParent: null, // {type, id}
    objectWaitingForIW: null, // {type, id}

    // details pane:
    objectForDetails: null, // {type, id} pair

    // selected concept
    selectedConcept: null, // id

    // for iw drawing
    DSmounted: [],   // {list of DS id which are moutned in the tree} 
  },
  getters: {
    efmProjectApi: (state) => {
      const native_project_id = state.treeInfo.id;
      let url = efmApi + native_project_id + "/";
      return url;
    },
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

    ////////////////////////////////////////
    EFMobjectInfo:
      (state) =>
      (type, id = null) => {
        // returns info about EFM Object
        // console.log('EFM OBJECT INFO ')
        // console.log(type, id)
        let objInfo =  JSON.parse(JSON.stringify(state.efmObjects[type]))
        // if id is set, it already adapts all URLs and other info which is ID sensitive:
        if (id) {
          for (let i in objInfo) {
            if (typeof objInfo[i] == "string") {
              // console.log(objInfo[i]  + String(id))
              objInfo[i] = objInfo[i].replace("{id}", String(id));
              // console.log(objInfo[i])
            }
          }
        }
        return objInfo;
      },
    getEFMobjectByID: (state) => (type, id) => {
      return state[type].find((obj) => obj.id == id);
    },
    getEFMobjectsByType: (state) => (type) => {
      return state[type];
    },
    efmObjectChildren: (state, getters) => (type, id) => {
      // returns list with type, id of each childobject of an efm object
      // needed for state consistency checks with the backend
      // console.log('getting all children of ' + type + id)

      // either returns all objects of children.type in children.list
      // or finds objects of children.type with id in their children.id_string field

      // returns empty list if children = null

      const objInfo = getters.EFMobjectInfo(type, id);
      const theObject = getters.getEFMobjectByID(type, id);

      let allChildrenList = [];

      // for (let c of objType.children) {
      if (objInfo.children) {
        const c = objInfo.children
        if (c.id_string) {
          // case: c = {type, id_string}
          // i.e. children need to be found by their parent_id
          let childObjectList = state[c.type].filter(child => child[c.id_string] == id)
          for (let cObject of childObjectList) {
            allChildrenList.push({ type: c.type, id: cObject.id })
          }
        } else if (Array.isArray(theObject[c.list])) {
          // c is like {type: 'ds', list: 'is_solved_by_id'}
          // here we iterate through the objects children list
          for (let cc of theObject[c.list]) {
            // c.list contains IDs when backend is set correctly

          // console.log('found child ' + c.type + cc + ' of ' + type + id)
            allChildrenList.push({ type: c.type, id: cc });
          }
        } else {
          // in case that c.list is no list but just a single value, e.g. top_level_ds_id
        // console.log('found child ' + c.type + " " + theObject[c.list] + ' of ' + type + id)
          allChildrenList.push({ type: c.type, id: theObject[c.list] });
        }
      }
      return allChildrenList;
    },
    efmObjectAllChildrenRecursive: (state, getters) => (type, id) => {
      // console.log('getting all children (recursive) of ' + type + id)
      let allChildrenList = getters.efmObjectChildren(type, id);
      // console.log('allChildrenList' + type + id)
      // console.log(allChildrenList)

      let returnChildrenList = [];

      for (let c of allChildrenList) {
        // console.log('recursing one level deper onto ' + c.type + c.id)
        let recursiveChildren = getters.efmObjectAllChildrenRecursive(
          c.type,
          c.id
        );
        returnChildrenList = returnChildrenList.concat(recursiveChildren);
      }

      returnChildrenList = returnChildrenList.concat(allChildrenList);

      // console.log('returnChilrenList' + type + id)
      // console.log(returnChildrenList)
      return returnChildrenList;
    },
    efmObjectPossibleParents: (state, getters) => (type, id) => {
      // returns a list of possible parent objects,
      // that is all objects of other type ( DS <> FR ) which are not below in the tree
      // returns list of objects
      // console.log('getting all possible parents of ' + type + id)

      const objInfo = getters.EFMobjectInfo(type, id);

      let allPossibleParents = getters.getEFMobjectsByType(objInfo.parentType);

      let allChildrenID = getters.efmObjectAllChildrenRecursive(type, id);

      let allChildren = []; // rewrite array with objects instead of type:id pairs
      for (let c of allChildrenID) {
        // c[0] = type, c[1] = id
        if (c.type == objInfo.parentType) {
          // filter to only include parentType
          allChildren.push(getters.getEFMobjectByID(c.type, c.id));
        }
      }
      // console.log('lists in possibleparent function')
      // console.log(allChildrenID)
      // console.log(allChildren)
      // console.log(allPossibleParents)
      allPossibleParents = allPossibleParents.filter(
        (p) => !allChildren.includes(p)
      );

      return allPossibleParents; // list of efm objects
    },
    efmObjectPossibleIW: (state, getters) => (id) => {
      // returns a list of all DS which the DS with 'id' can create an iw with
      // i.e. only DS which can possibly be in the same concept
      // i.e. not in an alternative to this or any parent DS's alternative

      const theObj = getters.getEFMobjectByID("ds", id);

      let parentObj = getters.getEFMobjectByID("fr", theObj.isbID);

      let alternativeDS = []; // list of DS id

      while (parentObj) {
        let directAlternatives = parentObj.is_solved_by_id.filter(
          (i) => i != id
        );
        alternativeDS = alternativeDS.concat(directAlternatives);
        const grandParent = getters.getEFMobjectByID("ds", parentObj.rfID);
        if (!grandParent.is_top_level_DS) {
          parentObj = getters.getEFMobjectByID("fr", grandParent.isbID);
        } else {
          parentObj = null;
        }
      }

      let possibleForIW = getters.getEFMobjectsByType("ds");
     // console.log(alternativeDS);
      possibleForIW = possibleForIW.filter(
        (ds) => !alternativeDS.includes(ds.id)
      );

      return possibleForIW;
    },
    efmObjectParent: (state, getters) => (type, id) => {
      const objInfo = getters.EFMobjectInfo(type, id);
      const objData = getters.getEFMobjectByID(type, id);
      let parent = null;
      if (objInfo.parentID) {
        parent = getters.getEFMobjectByID(
          objInfo.parentType,
          objData[objInfo.parentID]
        );
      }
      return parent;
    },
    incomingIWofDS: (state, getters) => (id) => {
      // returns all iw which have the DS with _id_ as toDS
      // adds ds names to the objects as toName, fromName
      let iwList = state.iw.filter((iw) => iw.to_ds_id == id);
      for (let iw of iwList) {
        const toDS = getters.getEFMobjectByID("ds", iw.to_ds_id);
        const fromDS = getters.getEFMobjectByID("ds", iw.from_ds_id);
        iw.fromName = fromDS.name;
        iw.toName = toDS.name;
      }
      return iwList;
    },
    outgoingIWofDS: (state, getters) => (id) => {
      // returns all iw which have the DS with _id_ as fromDS
      // adds ds names to the objects as toName, fromName
      let iwList = state.iw.filter((iw) => iw.from_ds_id == id);
      for (let iw of iwList) {
        const toDS = getters.getEFMobjectByID("ds", iw.to_ds_id);
        const fromDS = getters.getEFMobjectByID("ds", iw.from_ds_id);
        iw.fromName = fromDS.name;
        iw.toName = toDS.name;
      }
      return iwList;
    },
    efmObjectConstraints: (state) => (type, id) => {
      if (type == "ds") {
        // only useful for DS
        return state.c.filter((c) => c.icb_id == id);
      } else if (['fp', 'dp', 'bp'].includes(type)) {
        // in case of paramters
        // simply return the object's own constraints property
        let object = state[type].find(p => p.id == id)
        console.log(object)
        return object.constraints
      } else{
        return [];
      }
    },
    efmParametersOfObject: (state) => (type, id) => {
      // returns array {dp, bp, fp}

      let fp = []
      let dp = []
      let bp = []
      
      if (type == 'ds') {
        dp = state.dp.filter(p => p.ds_id == id)
        bp = state.bp.filter(p => p.ds_id == id)
      } else {
        fp = state.fp.filter(p => p.fr_id == id)
      }
      return {
        bp: bp,
        dp: dp,
        fp: fp,
      }
    },

    // for GUI based selection of new parents ect
    objectIsToBeSelected: (state, getters) => (type, id) => {
      // returns true/false whether type, id is in the array objectsToSelect
      // console.log('objectIsToBeSelected: ' + type + id)
      const theObj = getters.getEFMobjectByID(type, id);
      const isInSelectedObjects = state.objectsToSelect.find(
        (o) => o == theObj
      );
      // console.log(isInSelectedObjects)
      // console.log(state.objectsToSelect)
      if (isInSelectedObjects) {
        return true;
      } else {
        return false;
      }
    },
    theSelectedObject: (state) => {
      return state.selectedObject;
    },
    whoIsWaitingForParent: (state) => {
      return state.objectWaitingForNewParent;
    },
    whoIsWaitingForIW: (state) => {
      return state.objectWaitingForIW;
    },

    objectForDetails: (state) => {
      return state.objectForDetails;
    },
    isSelectedForDetails: (state) => (type, id) => {
      if (state.objectForDetails && state.objectForDetails.type == type && state.objectForDetails.id == id) {
        return true;
      } else {
        return false;
      }
    },
    // Concepts
    allConcepts: (state) => {
      return state.concepts;
    },
    conceptByID: (state) => (id) => {
      return state.concepts.find((c) => c.id == id);
    },
    selectedConcept: (state) => {
      return state.concepts.find((c) => c.id == state.selectedConcept);
    },
    iwToDraw: (state) => {
      // return state.iw.filter(iw => iw.to_ds_mounted && iw.from_ds_mounted)
      const iwToDraw = state.iw.filter( iw => 
        (state.DSmounted.includes(iw.from_ds_id) &&
        state.DSmounted.includes(iw.to_ds_id) )
      )
      return iwToDraw
    }
  },
  mutations: {
    setTreeList(state, payload) {
      // sets the list of all trees in state
      state.treeList = payload;
    },
    addTree(state, tree) {
      state.treeList.push = tree;
    },
    setAllEfmObjects(state, theTree) {
      // payload is a tree data object as returned by efm/trees/{id}/data
      state.treeInfo = {
        name: theTree.name,
        description: theTree.description,
        id: theTree.id,
        top_level_ds_id: theTree.top_level_ds_id,
      };
      state.ds = theTree.ds;
      state.fr = theTree.fr;
      state.c = theTree.c;
      state.iw = theTree.iw;

      // special for iw names
      for (let iw of state.iw) {
        iw.name = iw.iw_type + " interaction"
      }
    },
    setAllConcepts(state, concepts) {
      state.concepts = concepts;
    },
    setAllParameters(state, parameters) {
      state.dp = parameters['design_parameters']
      state.fp = parameters['function_parameters']
      state.bp = parameters['behaviour_parameters']
      state.pc = parameters['parameter_constraints']
      // state.params = parameters['design_parameters'].concat(parameters['function_parameters'], parameters['behaviour_parameters'])

      // state.pc = parameters['parameter_constraints']
      for (let p of state.dp) {
        p.constraints = parameters['parameter_constraints'].filter(pc => pc.parameter_id == p.id)
      }
      for (let p of state.fp) {
        p.constraints = parameters['parameter_constraints'].filter(pc => pc.parameter_id == p.id)
      }
      for (let p of state.bp) {
        p.constraints = parameters['parameter_constraints'].filter(pc => pc.parameter_id == p.id)
      }
    },
    unsetTreeData(state) {
      state.treeInfo = null
      state.ds = []
      state.fr = []
      state.c = []
      state.iw = []
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
     // console.log("editDS index " + String(index));

      if (index != -1) {
        // console.log('please compare')
        // console.log(state.ds[index])
        // console.log(data)
        state.ds[index] = data;
       // console.log(state.ds[index]);
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
    deleteTree(state, id) {
      console.log('deleting tree from store')
      state.treeList = state.treeList.filter(obj => obj.id != id);
    },

    // gui based selections
    setObjectsToSelect(state, objectList) {
      // sets the list of to be selected objects to objectList
      // objectList must be  [{type: type, id:id}, ...]
      state.objectsToSelect = objectList;
    },
    objectIsSelected(state, object) {
      // sets the selected object to object
      // object is {type, id} pair
      state.selectedObject = object;
    },
    setWaitingForNewParent(state, object) {
      // object= {type, id}
      state.objectWaitingForNewParent = object;
    },
    setWaitingForIW(state, object) {
      // object = {type, id}
      state.objectWaitingForIW = object;
    },
    cancelSelection(state) {
      state.objectWaitingForIW = null;
      state.objectsToSelect = [];
      state.objectWaitingForNewParent = null;
    },
    setObjectForDetails(state, object) {
      // object is {type, iw}
      state.objectForDetails = object;
    },
    selectConcept(state, id) {
      state.selectedConcept = id;
    },

    // specials for iw drawing
    iwEndPointsReady(state, startAndEndPoints) {
      const iwStartPoints = startAndEndPoints.iwStartPoints
      const iwEndPoints = startAndEndPoints.iwEndPoints
      // console.log(iwStartPoints, iwEndPoints)
      // both lists contain full iw objects
      for (let i of iwStartPoints) {
        // fetch up-to-date from store
        if (!state.iwMountedEndpoints.startpoints.find(iw => iw == i))
        state.iwMountedEndpoints.startpoints.push(i)
        // let startIW = state.iw.find(iw => iw.id == i.id)

        // // set starting value
        // startIW.from_ds_mounted = true

        // // pop from state
        // state.iw = state.iw.filter(iw => iw.id != i.id)
        // // push the edited one back to store
        // state.iw.push(startIW)
      }

      // and same for endpoitns
      for (let i of iwEndPoints) {
        if (!state.iwMountedEndpoints.endpoints.find(iw => iw == i))
        state.iwMountedEndpoints.endpoints.push(i)
        // fetch up-to-date from store
        // let startIW = state.iw.find(iw => iw.id == i.id)

        // // set starting value
        // startIW.to_ds_mounted = true

        // // pop from state
        // state.iw = state.iw.filter(iw => iw.id != i.id)
        // // push the edited one back to store
        // state.iw.push(startIW)
      }
    },
    reportDSasMounted(state, dsID) {
      console.log('ds noted, ' + dsID)
      state.DSmounted.push(dsID)
    },
    reportDSunmounted(state, dsID) {
      state.DSmounted = state.DSmounted.filter(ds => ds.id != dsID)
    },
  },
  actions: {
    async newTree({ commit, dispatch }, { projectID, treeData }) {
      const newTreeData = {
        name: treeData.name,
        description: treeData.description,
      };
      let theTree = await dispatch(
        "apiCall",
        {
          url: efmApi + projectID + "/newTree",
          method: "POST",
          objectData: newTreeData,
        },
        { root: true }
      );
      if (theTree) {
        commit("addTree", theTree);
        return theTree
      } else {
        return false
      }
    },
    async getTreeList({ commit, dispatch }) {
      let allTrees = await dispatch(
        "apiCall",
        {
          url: efmApi + "trees",
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
      // sets all data to display a specific tree
      // sets ds, fr, c, iw ,...
      let theTree = await dispatch(
        "apiCall",
        {
          url: efmApi + "trees/" + treeID + "/data",
          method: "GET",
        },
        { root: true }
      );

      let theParameters = await dispatch(
        "apiCall",
        {
          url: efmApi + treeID + "/parameters",
          method: "GET",
        },
        { root: true }
      );
      // in case error, so it's not "undefined" but empty array
      if (!theTree) {
        theTree = [];
      } else {
       // console.log(theTree);
        commit("setAllEfmObjects", theTree);
        commit("setAllParameters", theParameters);
        commit("goodNews", 'Loaded all elements of "' + theTree.name + '".', {
          root: true,
        });
      }
    },
    async updateTree({ getters, commit, dispatch }) {
      // updates all current tree data via /trees/id/data
      // actually only wrapts getTree with the current tree's ID
      let treeID = getters.treeInfo.id;
     // console.log("ffs: " + treeID);
      dispatch("getTree", { treeID });
      commit("goodNews", "updated all tree items", { root: true });
    },
    async getConcepts({ getters, commit, dispatch }) {
      const theTree = getters.treeInfo;
      let allConcepts = await dispatch(
        "apiCall",
        {
          url: efmApi + "trees/" + theTree.id + "/instantiate",
          method: "GET",
        },
        { root: true }
      );
     // console.log(allConcepts);
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
    async deleteTree({ getters, commit, dispatch }, { treeID }) {
      const objType = getters.EFMobjectInfo("tree", treeID);
      // delete call returns rowcount, i.e. number of affected rows
      let deletion = await dispatch(
        "apiCall",
        {
          url: efmApi + objType.deleteURL,
          method: "DELETE",
        },
        { root: true }
      );
      console.log(deletion)
     // console.log(deletion);
      if (deletion) {
        commit("deleteTree", treeID);
        commit("deleteSubproject", treeID, {root: true,})
        commit("goodNews", "Deleted Tree. Deleted a total of " + deletion + " EFM elements", { root: true });
      }
      return deletion;
    },

    async newEFMobject({ getters, commit, dispatch }, { type, data }) {
      // submits "data" to the right backend point depending on efmObjects / type
      // posts the return value to local storage
      // returns new object or null (if error)

      const objType = getters.EFMobjectInfo(type);
      const efmProjectUrl = getters.efmProjectApi;

      var newObject = null;

      try {
       // console.log('api call "newEFMobject"');
       // console.log("objecttype: " + objType.short);
       // console.log(data);
        newObject = await dispatch(
          "apiCall",
          {
            url: efmProjectUrl + objType.postURL,
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
          "goodNews", "Created new " + objType.string + ": " + newObject.name,
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
      const efmProjectUrl = getters.efmProjectApi;

      // let putURL = objType.putURL;
     // console.log("putURL: " + putURL);

      let newObjectData = await dispatch(
        "apiCall",
        {
          url: efmProjectUrl + objType.putURL,
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
          "goodNews", "Edited " + objType.string + ": " + newObjectData.name,
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
      const efmProjectUrl = getters.efmProjectApi;

      console.log(type, id)
      console.log(objType)

      let deletion = await dispatch(
        "apiCall",
        {
          url: efmProjectUrl + objType.deleteURL,
          method: "DELETE",
        },
        { root: true }
      );
     // console.log(deletion);
      if (deletion) {
        // commit(objType.deleteMutation, id);
        commit(
          "goodNews", "Deleted " + objType.string + ". A total of " + deletion + " EFM elements have been deleted.",
          { root: true }
        );
        // // and we need to check all the children too, since they probably need to be removed as well
        // for (let child of getters.efmObjectChildren(type, id)) {
        //   // child should be [type, id]
        //   dispatch('updateEFMobject', {type: child[0], id: child[1]})
        // }

        // update all tree data, since doing it one by one is too complicated:
        dispatch("updateTree");
        return deletion;
      }
    },
    // async updateEFMobject({ getters, commit, dispatch }, { type, id }) {
    //   // fetches the info of a EFM object and updates state
    //   // deletes if 404
    //   // recursively updates children
    //   // mainly used in edit and delete EFM object actions for chidlren and parents of edited/deleted objects

    //   const objType = getters.EFMobjectInfo(type, id);
    //   const efmProjectUrl = getters.efmProjectApi;

    //   // let theObjectInState = getters.getEFMobjectByID(type, id)

    //   let theObjectFromDB = await dispatch(
    //     "apiCall",
    //     {
    //       url: efmProjectUrl + objType.getURL,
    //       method: "GET",
    //     },
    //     { root: true }
    //   );

    //   if (theObjectFromDB === 404) {
    //     // type sensitive check needed here!
    //     // if 404 (not found, i.e. deleted) we remove from state:
    //     commit(objType.deleteMutation, id);
    //     // and we need to check all the children too, since they probably need to be removed as well
    //     for (let child of getters.efmObjectChildren(type, id)) {
    //       // child should be [type, id]
    //       dispatch("updateEFMobject", { type: child[0], id: child[1] });
    //     }
    //   } else if (theObjectFromDB) {
    //     // if we get a return we just update it in state:
    //     commit(objType.putMutation, theObjectFromDB);
    //   }
    // },

    async setNewRelationFromGui(
      { getters, commit, dispatch },
      { newRelation }
    ) {
      // sets new relations from the gui selector
      // newRelation is an efmObject
      // can be used for parents, iw, .. depending on "who is waiting"

      const efmProjectUrl = getters.efmProjectApi;
      let returnData = null

      if (getters.whoIsWaitingForParent) {
       // console.log("setting new parent via GUI");

        // fetch who is waiting for the parent
        const theObj = getters.whoIsWaitingForParent;

        // fetch object info for that
        const objectInfo = getters.EFMobjectInfo(theObj.type, theObj.id);
        // const parentType = objectInfo.parentType;

       // console.log(
        //   "setting new parents for" +
        //     theObj.type +
        //     theObj.id +
        //     ", parentType: " +
        //     parentType +
        //     ", new parent: " +
        //     newRelation.name
        // );

        let submitData = { query: "new_parent_id", value: newRelation.id };

        let newParentUrl = objectInfo.newParentUrl;
        // dispatch to backend
        let newObjData = await dispatch(
          "apiCall",
          {
            url: efmProjectUrl + newParentUrl,
            query: [submitData],
            method: "PUT",
          },
          { root: true }
        );

        // and we have to reset all variables:
        if (newObjData) {
          commit("setWaitingForNewParent", null);
          commit("objectIsSelected", null);
        }
      } else if (getters.whoIsWaitingForIW) {
        const whoIsWaitingForIW = getters.whoIsWaitingForIW;
        const theOtherEnd = newRelation;
        const submitData = {
          from_ds_id: whoIsWaitingForIW.id,
          to_ds_id: theOtherEnd.id,
          iw_type: "spatial",
        };
        let newIW = await dispatch(
          "apiCall",
          {
            url: efmProjectUrl + "iw/new",
            objectData: submitData,
            method: "POST",
          },
          { root: true }
        );

        // and we have to reset all variables:
        if (newIW) {
          commit("setWaitingForIW", null);
          commit("objectIsSelected", null);
          returnData = {
            iw: newIW,
            edit: {
              objectType: 'iw',
              editID: newIW.id
            }
          }
        }
      }
      // update all tree data, since doing it one by one is too complicated:
      await dispatch("updateTree");
      return returnData
    },
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
    deleteSubproject(state, treeID) {
      // have to iterate through all projects....
      for (let p of state.projects){
        p.subprojects = p.subprojects.filter(sp => (sp.tree && sp.tree.id != treeID))
      }
    },
  },
  actions: {
    async fetchProjects({ commit, dispatch }) {
      // fetches all projects of user into store
     // console.log("fetching projects");
      let projects = await dispatch("apiCall", {
        url: "core/projects/",
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
      });

      // this is an EFM call in core; i know it shouldn't be here... but it is!
      let trees = await dispatch("apiCall", {
        url: "efm/trees/",
      });
     // console.log("trees: ");
     // console.log(trees);

      if (projects) {
        // fetching subprojects
        for (let p of projects) {
          let subprojects = await dispatch("apiCall", {
            url: "core/projects/" + p.id + "/subprojects",
          });
          if (subprojects) {
            // filter to EFM subprojects only
            subprojects = subprojects.filter(sp => sp.application_sid == "MOD.EFM")
            p.subprojects = subprojects;
            for (let sp of p.subprojects) {
              sp.tree = trees.find((t) => t.id == sp.native_project_id);
            }
          }
        }
       // console.log(projects);
        commit("addAllProjects", projects);
      }
    },
    async newProject({ dispatch, commit, rootGetters }, { projectName }) {
      const currentUser = rootGetters.getUser;
     // console.log(currentUser);
      if (!currentUser) {
        commit("registerError", {
          message: "you are not logged in!",
          component: "createNewProject",
        });
        return false;
      }
      let access = {};
      access[currentUser.id] = 4;

      let newProjectData = {
        name: projectName,
        participants: [currentUser.id],
        participants_access: access,
      };

      let newProject = await dispatch("apiCall", {
        url: "core/projects",
        method: "POST",
        objectData: newProjectData,
      });
      commit("addProject", newProject);
      return newProject;
    },
    async editProjectName({ commit, dispatch }, { key, projectName }) {
      // key needs to be submitted seperately to the function bc projectdata does not necessarily include it!

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
          "goodNews", "Edited project name to " + projectName,
          { root: true }
        );
      }
      return success;
    },
  },
};

export default new Vuex.Store({
  namspaced: true,
  state: {
    loginSessionDuration: 30 * 60 * 1000, // time until logout
    token: null,
    user: {}, // user object from API
    // {
    //   "id": 1,
    //   "username": "admin",
    //   "email": null,
    //   "full_name": null,
    //   "disabled": null,
    //   "scopes": "admin"
    // }
    messages: [],
    // {
    //   type: warning, error or info (info standard)
    //   message: String,
    //   component: string - component name, default 'general'
    //   id: 4-digit-random-alphanumerical
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
      if (state.user) {
        return state.user.scopes;
      } else {
        return null;
      }
    },
    getAuthToken: (state) => {
      if (state.token) {
        return state.token
      } else {
        return {
          token: sessionStorage.getItem("access_token"),
          token_type: sessionStorage.getItem("token_type")
        }
      }
    },
    loggedIn: (state, getters) => {
      // returns true or false
      // let deltaT = state.loginSessionDuration
      let token = getters.getAuthToken
      

      if (
        // check if we have sessionStorage auth
        token.access_token && 
        token.token_type 
        // check if the 30min session is over:
        // (sessionStorage.getItem("loginTime") +deltaT) > Date.now()
      ) {
       // console.log("found session storage auth");
        return true;
      } else {
       // console.log("login check failed");
       // console.log(sessionStorage.getItem("token_type"));
       // console.log(sessionStorage.getItem("access_token"));
       // console.log(sessionStorage.getItem("loginTime") > Date.now() - deltaT);
        return false;
      }
    },
    getAllMessages: (state) => {
      // returns an array of all messages
      return state.messages;
    },
    getErrorsOfComponent: (state) => (componentName) => {
      // returns an array of all errors
      // used to display error messages in App.vue
      return state.messages.filter((e) => e.component == componentName);
    },
    isLoading: (state) => {
      return state.loading;
    },
    allApps: (state) => {
      return state.apps;
    },
  },
  mutations: {
    logout(state) {
      // remove user-related objects from store:
      this.commit('clearAllMessages')
      state.apps = [];
      state.user = null;
      sessionStorage.removeItem("token_type");
      sessionStorage.removeItem("access_token");
      this.commit('setAuthToken', null)
      this.commit('goodNews', "you have been logged out!")
     // console.log("logged out...");
    },
    setAuthToken(state, token) {
      state.token = token
      if (token) {
        // sessionStorage.setItem("access_token", token["access_token"]);
        // sessionStorage.setItem("token_type", token["token_type"]);
        sessionStorage.setItem("loginTime", Date.now());
      }
    },
    registerError(state, payload) {
      // registers a new error
      // payload either string as error message or object, see states

      // first generate an ID
      let errorID = random_s4();
      while (state.messages.filter((e) => e.id == errorID).length) {
        // generate new one
        errorID = random_s4();
      }

      var error = {
        type: 'error',
        id: errorID,      
      };
      if (typeof payload === String) {
        error.message = payload
        error.component = "general"
      } else {
        error.message = payload.message
        error.component = payload.component
      }
     // console.log("error by " + error.component + ": " + error.message);
      state.messages.push(error);
    },
    removeMessage(state, errorID) {
      // removes errors by array index; used in ErrorMessage.vue to dismiss not only the error but remove it
      state.messages = state.messages.filter((e) => e.id != errorID);
    },
    clearMessages(state, componentName) {
      // use with caution when component = ''
      // otherwise to clear all errors of a component, e.g. 'LoginProcess'
       // console.log("deleting errors of " + componentName);
      state.messages = state.messages.filter((e) => e.component != componentName);
    },
    clearAllMessages(state) {
       // console.log("deleting ALL messages");
      state.messages = [];
    },
    goodNews(state, payload) {
     // console.log("good news: " + payload);
      // first create ID
      let newsID = random_s4();
      while (state.messages.filter((e) => e.id == newsID).length) {
        // generate new one
        newsID = random_s4();
      }
      const news = {
        type: 'info',
        component: '',
        message: payload,
        id: newsID,
      };
      state.messages.push(news);
    },
    startLoading(state) {
      state.loading = true;
    },
    stopLoading(state) {
      state.loading = false;
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
    async login({getters, commit }, user) {
      commit("startLoading"); // loading window
      // the login process
      commit("clearMessages", "loginProcess");

      const backend = getters.backendURL
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
        const response = await fetch(backend + "core/auth/token/", {
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
          commit('goodNews', 'Log in sucessful!')
          // success!
          let token = {
            access_token: data.access_token,
            token_type: data.token_type,
          };
          commit("setAuthToken", token)
         // console.log('set auth credentials to storage')

          // user = getters.getUser

          // const userRequest = await fetch(settings.backend + "users/me", {
          //   headers: {
          //     "Content-Type": "application/json; charset=UTF-8",
          //     Authorization:
          //       sessionStorage.token_type + " " + sessionStorage.access_token,
          //   },
          // });
          // const userFromDB = await userRequest.json();
          // console.log(userFromDB);

          // commit("auth_success", { token: token, user: userFromDB });

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

     // console.log(url);
     // console.log(method);
     // console.log(objectData);

      let returnValue = false;

      const backend = getters.backendURL

      try {
        ////////////////////////////////////////////////////////////
        // assembling URL
        let urlToFetch = String(backend + url);
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
          const token = getters.getAuthToken
          // in case of logged in we want to add authorisation
          // doesn't hurt if it is not requried...
         // console.log("logged in, adding auth");
          messageHeader = Object.assign(messageHeader, {
            Authorization:
              token.token_type + " " + token.access_token,
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
          messageData = Object.assign(messageData, {
            headers: messageHeader,
          });
        }

       console.log(messageData);
       console.log(settings.backend)
       console.log(urlToFetch);

        const response = await fetch(urlToFetch, messageData);

        //const data = await response.json()
        if (response.status === 200) {
          //console.log(response.json())
          returnValue = await response.json();
         // console.log(returnValue);
          // console.log(returnValue)
          if (!returnValue) {
            // in case of e.g. deletion where there is only 200 as response
            returnValue = true;
          }
        } else {
          returnValue = await response.json();
         // console.log(returnValue);
          commit("registerError", {
            message:
              "Error " +
              response.status +
              " from backend: " +
              returnValue.detail,
            component: "APIcall",
          });
          console.error('[API call]' + returnValue.detail)
        }
        // } else if (response.status === 401) {
        //   // commit("logout");
        //   commit("registerError", {
        //     message:
        //       "You are not logged in or don't have permission for this function",
        //     component: "APIcall",
        //   });
        // } else if (response.status === 404) {
        //   commit("registerError", {
        //     message: "Element couold not be found",
        //     component: "APIcall",
        //   });
        //   returnValue = 404; // identifier for a 404
        // } else {
        //   commit("registerError", {
        //     message:
        //       "Error " +
        //       response.status +
        //       ' Could not perform API call for: url="' +
        //       url +
        //       '", method="' +
        //       method +
        //       '", data="' +
        //       JSON.stringify(objectData) +
        //       '".',
        //     component: "APIcall",
        //   });
        // }
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
    //////////////// special calls
    async fetchApps({ commit, dispatch }) {
      // Fetches the app info from the backend and stores into store.apps
      for (let a of settings.apps) {
       // console.log("fetching app " + a);
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
    settings: settingsStore,
  },
});
