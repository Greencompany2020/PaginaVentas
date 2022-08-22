import { useEffect} from 'react';
import {  useDispatch } from 'react-redux';
import getInitialUserData from '../redux/actions/getInitialUserData';
import jsCookie from 'js-cookie';
import { useRouter } from 'next/router';

export default function useProviderAuth(){
    const dispatch = useDispatch();
    const token = jsCookie.get('accessToken');
    const router = useRouter();

    useEffect(()=>{
        (async ()=>{
            try {
                if(token) dispatch(getInitialUserData())
            } catch (error) {
                router.push('/');
            }    
        })()
    },[])
}