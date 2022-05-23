import * as service from '../services/AccessService';
import { useEffect, useReducer} from 'react';
import { sliceFilter } from '../utils/functions';


const initialState = {
    users: {
        dataFilter:[],
        data:[],
        show:10,
        pages:0,
        current:1,
    },
    groups: [],
    access: {
        dataFilter:[],
        data:[],
        show: 10,
        pages: 0,
        current: 1,
        selected:{}
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
                return{...state, users:{...state.users, data:action.payload}}
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
            case "SET_SELECTED_ACCESS":
                return{...state, access:{...state.access, selected:action.payload}}
            case "PAGINATE_USERS":
                return{...state, users:{...state.users, dataFilter:[...action.payload.slicer], pages:action.payload.pages}}
            case "SELECT_USERS_PAGE":
                return{...state, users:{...state.users, dataFilter:[...action.payload.slicer], current:action.payload.next}}
            case "FILTER_USERS":
                return{...state, users:{...state.users, dataFilter:[...action.payload.slicer]}}
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);
   

    const getUsers = async () => {
        const data = await service.get_users();
        if(data) {
            const {slicer, pages} = sliceFilter(data, state?.users?.show, state?.users?.current);
            dispatch({type: 'SET_USERS', payload:data});
            dispatch({type:'PAGINATE_USERS', payload:{slicer, pages}});
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
            const user = state.users.data.filter(user => user.Id === data.Id)[0];
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

    const selectAccess = selectItem => {
        const access = state.access.data.filter(item => item.idDashboard === selectItem.idDashboard)[0];
        dispatch({type: 'SET_SELECTED_ACCESS', payload:access});
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
            await getUserAccess(state.user.Id);
        }
    }


    const createUser = async(body) => {
        const response = await service.post_createUser(body);
        if(response){
            await getUsers();
            return true;
        }
        return false;
    }

    const updateUser = async(id, body) => {
        let {password, ...values} = body;
        const data = await service.put_updateUser(id, values);
        if(data){
            await getUsers();
            getUserAccess(id);
            return true;
        }
        return false;
    }

    const deleteUser = async(id) => {
        const response = await service.del_deleteUser(id);
        if(response){
            await getUsers();
            return true;
        }
        return false;
    }

    const createGroup = async(id) => {
        const response  = await service.post_createGroup(id);
        if(response){
            await getGroups();
            return true;
        }
        return false;
    }


    const updateGroup = async (id, body) => {
        const {Nombre} = body;
        const response = await service.put_updateGroup(id, Nombre);
        if(response){
            await getGroups();
            return true;
        }
        return false;
    }
    
    const deleteGroup = async (id) => {
        const response = await service.del_deleteGroup(id);
        if(response){
            await getGroups();
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


    const createAccess = async(body) => {
        const response = await service.post_createAccess(body);
        if(response) {
            await getAccess();
            return true;
        }
        return false;
    }

    const updateAccess = async(body) => {
        if(Object.keys(state?.access?.selected).length == 0) return false
        const id = state?.access?.selected?.idDashboard;
        const response = await service.put_updateAccess(id, body);
        if(response){
            await getAccess();
            selectAccess(state?.access?.selected);
            return true;
        }
        return false;
    }

    const deleteAccess = async(id) => {
        const response = await service.del_deleteAccess(id);
        if(response){
            await getAccess();
            return true;
        }
        return false;
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
        const search = value.replace(/\s+/g, '');
        if(search.length > 0){
            const equals = state?.access?.data.filter(access => (access.nombreReporte.includes(search) || access.menu.includes(search) || access.reporte.includes(search)));
            const {slicer} = sliceFilter(equals, state?.access?.show, 1);
            dispatch({type:'FILTER_ACCESS',payload:{slicer}})
        }else{
            const {slicer} = sliceFilter(state?.access?.data, state?.access?.show, state?.access?.current);
            dispatch({type:'FILTER_ACCESS',payload:{slicer}})
        }
        
        
    }


    const handleNextUser = (next) => {
        if(state?.users?.data){
            if(next > 0 && next <= state.users.pages){
                const {slicer} = sliceFilter(state?.users?.data, state?.users?.show, next);
                dispatch({type:'SELECT_USERS_PAGE', payload:{slicer, next}});
            }
        }
    }


    const handleSearchUser = (evt) => {
        const {value} = evt.target;
        const search = value.replace(/\s+/g, '');
        if(search.length > 0){
            const equals = state?.users?.data.filter(user => (user.UserCode.includes(search) || user .Nombre.includes(search) || user.Email.includes(search)));
            const {slicer} = sliceFilter(equals, state?.users?.show, 1);
            dispatch({type:'FILTER_USERS',payload:{slicer}})
        }else{
            const {slicer} = sliceFilter(state?.users?.data, state?.users?.show, state?.users?.current);
            dispatch({type:'FILTER_USERS',payload:{slicer}})
        }
        
        
    }



    
    useEffect(()=>{
       getUsers();
       getGroups();
       getAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        createAccess,
        selectAccess,
        updateAccess,
        handleNextUser,
        handleSearchUser,
        deleteAccess
    }
}