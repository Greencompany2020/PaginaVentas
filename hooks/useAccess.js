import * as service from '../services/AccessService';
import { useEffect, useReducer} from 'react';


const initialState = {
    users: [],
    groups: [],
    access: {
        dataFilter:[],
        data:[],
        show: 10,
        pages: 0,
        current: 1
    },
    user: {
        data:{},
        access:[]
    }
}

export default function useAccess(){

    const reducer = (state, action) => {
        switch(action.type){
            case "SET_USERS":
                return{...state, users:action.payload}
            case "SET_GROUPS":
                return{...state, groups:action.payload}
            case "SET_ACCESS":
                return{...state, access:{...state.access, data:action.payload}}
            case "PAGINATE_ACCESS":
                return{...state, access:{...state.access, dataFilter:[...action.payload.slicer], pages:action.payload.pages}}
            case "SELECT_ACCESS_PAGE":
                return{...state, access:{...state.access, dataFilter:[...action.payload.slicer], current:action.payload.next}}
            case "FILTER_ACCESS":
                return{...state, access:{...state.access, dataFilter:[...action.payload.slicer]}}
            case "SET_SELECTED_USER":
                return{...state, user:{data: action.payload.user, access:[...action.payload.access]}}
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);
   

    const getUsers = async () => {
        const data = await service.get_users();
        if(data) {
            dispatch({type: 'SET_USERS', payload:data})
        }
    }

    const getGroups = async () => {
        const data = await service.get_groups();
        if(data){
            dispatch({type:'SET_GROUPS', payload:data});
        };
    }

    const getAccess = async () => {
        const data = await service.get_access();
        if(data){
            const {slicer, pages} = sliceFilter(data, state?.access?.show, state?.access?.current);
            dispatch({type:'SET_ACCESS', payload:data});
            dispatch({type:'PAGINATE_ACCESS', payload:{slicer, pages}});
        }
    }

    const getUserAccess = async (id) => {
        
        const data = await service.get_userAccess(id);
        if(data){
            const user = state.users.filter(user => user.Id === data.Id)[0];
            const access = data.Accesos;
            replaceAccess(state.access.data, access);
            dispatch({type: 'SET_SELECTED_USER', payload:{user, access}});
            console.log(state);
        }
    }

    const updateUserAccess = async(id, value) => {
        const enabled = (value == true) ? 'N' : 'Y' ;
        const data = await service.put_updateUserAccess(id, enabled);
        if(data){
            getUserAccess(state.user.Id);
        }
    }


    const createUser = async(body) => {
        const response = await service.post_createUser(body);
        if(response) getUsers();
    }

    const replaceAccess = (prev, next) => {
      const filtered = prev.map(item => {
          const before = next.map(nextItem => {
              if(nextItem.idDashboard == item.idDashboard)return({...item, hola:'h'});
          });
          return before;
      });

      console.log(filtered);
    }

    const sliceFilter = (data, show ,current) =>{
        const dataLength = data.length;
        const pages = Math.ceil(dataLength / show);
        const limit = current * show;
        const offset = (current == 1) ? 0 : limit - show;
        const slicer = data.slice(offset, limit);
        return {
            slicer,
            pages
        }
    }

    const handleNext = (next) => {
        if(state?.access?.data){
            const {slicer} = sliceFilter(state?.access.data, state?.access?.show, next);
            dispatch({type:'SELECT_ACCESS_PAGE', payload:{slicer, next}});
        }
    }


    const handleSearch = (evt) => {
        const {value} = evt.target;
        const equals = state?.access?.data.filter(access => (access.nombreReporte.includes(value) || access.menu.includes(value) || access.reporte.includes(value)));
        const {slicer} = sliceFilter(equals, state?.access?.show, state?.access?.current);
        dispatch({type:'FILTER_ACCESS',payload:{slicer}})
    }

    
    useEffect(()=>{
       getUsers();
       getGroups();
       getAccess();
    },[])


    return{
        handleSearch,
        handleNext,
        state,
        getUserAccess,
        updateUserAccess,
        createUser,
    }
}