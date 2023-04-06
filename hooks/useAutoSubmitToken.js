import { useEffect, useRef } from "react";
import { useFormikContext } from "formik"

const AutoSubmitToken = ({alwaysFetch = true}) => {
    const { values, submitForm } = useFormikContext();
    const refetchOnChange = useRef(true);
    useEffect(() => {
        if(refetchOnChange.current == true){
            submitForm();
        }
         
        if(alwaysFetch === false && refetchOnChange.current == true){
           refetchOnChange.current = false;
        }
    }, [values, submitForm]);
    return null;
}

export default AutoSubmitToken;