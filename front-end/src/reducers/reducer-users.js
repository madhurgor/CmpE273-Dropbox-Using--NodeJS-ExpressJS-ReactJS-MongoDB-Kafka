const reducerUsers = (state = {
  firstname: '',
  lastname: '',
  username: '',
  password:'',
  token:'',
  file:[],
  folder:[],
  fileR:[],
  data:[],
  path:'/',
  ownfolders:[],
  groupfolders:[],
  group_o:'',
  group_s:{},
  ofiles:[]
}, action) => {
  switch(action.type){
    case "CHANGEUSERNAME":
        state={
          ...state,
          username: action.payload.username
        };
    break;
    case "SETTOKEN":
        state={
          ...state,
          token: action.payload.token
        };
    break;
    case "CHANGEFILE":
        state={
          ...state,
          file: action.payload.file
        };
    break;
    case "CHANGEOWNFILE":
        state={
          ...state,
          ofiles: action.payload.ofiles
        };
    break;
    case "CHANGEFOLDER":
        state={
          ...state,
          folder: action.payload.folder
        };
    break;
    case "CHANGEGROUPFOLDER":
        state={
          ...state,
          groupfolders: action.payload.groupfolders
        };
    break;
    case "CHANGEOWNFOLDER":
        state={
          ...state,
          ownfolders: action.payload.ownfolders
        };
    break;
    case "CHANGEGROUP":
        state={
          ...state,
          group_o: action.payload.group
        };
    break;
    case "CHANGESHAREDGROUP":
        state={
          ...state,
          group_s: action.payload.sgroup
        };
    break;
    case "CHANGEPATH":
        state={
          ...state,
          path: action.payload.path
        };
    break;
    case "CHANGEFILER":
        state={
          ...state,
          fileR: action.payload.fileR
        };
    break;
    case "SETINFO":
        state={
          ...state,
          data: action.payload.data
        };
    break;
    case "CLEAR":
        state={
          firstname: '',
          lastname: '',
          username: '',
          password:'',
          token:'',
          file:[],
          folder:[],
          fileR:[],
          data:[],
          path:'/',
          ownfolders:[],
          groupfolders:[],
          group_o:'',
          group_s:{},
          ofiles:[]
        };
    break;
    default:
    break;
  }
  return state;
};

export default reducerUsers;
