import * as service from '../services/AccessService';
import { useEffect, useReducer} from 'react';
import { sliceFilter } from '../utils/functions';


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
    },
    group:{}
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
                return{...state, user:{data:action.payload.user, access:[...action.payload.access]}}
            case "SET_SELECTED_GROUP":
                return{...state, group:action.payload}
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
            const replaced = replaceAccess(state.access.data, access);
            const {slicer, pages} = sliceFilter(replaced, state?.access?.show, state?.access?.current);
            dispatch({type: 'SET_SELECTED_USER', payload:{user, access}});
            dispatch({type:'SET_ACCESS', payload:replaced});
            dispatch({type:'PAGINATE_ACCESS', payload:{slicer, pages}});
        }
    }



    const selectGroup = selectItem => {
        const group = state.groups.filter(item => item === selectItem)[0];
        dispatch({type: 'SET_SELECTED_GROUP', payload:group});
    }

    const assignAccess = async(id, current) => {
        if(Object.keys(state.user.data).length == 0) return {success: false, message: 'No hay ningun usuario seleccionado'}
        if(!id) return {success: false, message: 'Este acceso no se encuentra correctamente configurado'}

        const enabled =  (current == true) ? 'N' : 'Y';
        const body = {idDashboard: id, idUser: state.user.data.Id, enabled};
        const response = await service.post_assignAccesToUser(body);
        if(!response) return {success:false, message: 'No se pudo asignar el acceso al usuario'}
        getUserAccess(state.user.data.Id)
        return {success:true, message: (current == true) ? 'Acceso retirado' : 'Acceso asignado' }
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
        if(response){
            getUsers();
            return true;
        }
        return false;
    }

    const updateUser = async(id, body) => {
        let {password, ...values} = body;
        const data = await service.put_updateUser(id, values);
        if(data){
            getUsers();
            return true;
        }
        return false;
    }

    const deleteUser = async(id) => {
        const response = await service.del_deleteUser(id);
        if(response){
            getUsers();
            return true;
        }
        return false;
    }

    const createGroup = async(id) => {
        const response  = await service.post_createGroup(id);
        if(response){
            getGroups();
            return true;
        }
        return false;
    }


    const updateGroup = async (id, body) => {
        const {Nombre} = body;
        const response = await service.put_updateGroup(id, Nombre);
        if(response){
            getGroups();
            return true;
        }
        return false;
    }
    
    const deleteGroup = async (id) => {
        const response = await service.del_deleteGroup(id);
        if(response){
            getGroups();
            return true;
        }
        return false;
    }

    const replaceAccess = (current, next) => {
        const modified = current.map(item => {
            let modify = {}
            next.forEach(userAccess => {
                if(item.idDashboard == userAccess.idDashboard){
                    modify = {...item, acceso:userAccess.acceso}
                }
            });
            if(Object.keys(modify).length > 0) return modify
            return {...item, acceso:false};
        });
        return modified
    }

    const handleNext = (next) => {
        if(state?.access?.data){
            if(next > 0 && next <= state.access.pages){
                const {slicer} = sliceFilter(state?.access.data, state?.access?.show, next);
                dispatch({type:'SELECT_ACCESS_PAGE', payload:{slicer, next}});
            }
        }
    }


    const handleSearch = (evt) => {
        const {value} = evt.target;
        const equals = state?.access?.data.filter(access => (access.nombreReporte.includes(value) || access.menu.includes(value) || access.reporte.includes(value)));
        const {slicer} = sliceFilter(equals, state?.access?.show, 1);
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
        createGroup,
        updateGroup,
        selectGroup,
        updateUser,
        deleteGroup,
        deleteUser,
        assignAccess,
    }
}