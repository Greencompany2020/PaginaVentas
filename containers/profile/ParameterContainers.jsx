import React,{useState, useEffect} from 'react';
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import AccessParameterList from '../../components/profile/AccessParameterList';

export default function ParameterContainers(props) {
    const service = userService();
    const sendNotification = useNotification();
    const [access, setAccess] = useState(undefined);

    useEffect(()=>{
        (async()=>{
            try {
                const response = await service.getUserAccess();
                const onlyEnables = response.filter(item => item.Enabled === 'Y');
                setAccess(onlyEnables);
            } catch (error) {
                sendNotification({
                    type:'ERROR',
                    message:'Error al consultar sus accesos'
                })
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return <AccessParameterList items={access}/>
}
