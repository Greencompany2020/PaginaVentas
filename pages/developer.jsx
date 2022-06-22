import React, {useEffect} from "react";
import Dropzone from "../components/dropzone";
import { useNotification } from "../components/notifications/NotificationsProvider";
export default function Developer() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const sendNotification = useNotification()
  useEffect(()=>{
    sendNotification({
      type:'',
      message:'hola'
    })
  },[])
  return <Dropzone />;
}

