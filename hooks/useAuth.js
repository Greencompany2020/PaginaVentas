import { useEffect} from 'react';
import {  useDispatch } from 'react-redux';
import getInitialUserData from '../redux/actions/getInitialUserData';
import jsCookie from 'js-cookie'

export default function useProviderAuth(){
    const dispatch = useDispatch();
    const token = jsCookie.get('accessToken');

    useEffect(()=>{
        (async ()=>{
            if(token) dispatch(getInitialUserData())
        })()
    },[])
}