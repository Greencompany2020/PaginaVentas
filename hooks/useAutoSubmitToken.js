import { useEffect } from "react";
import { useFormikContext } from "formik"

const AutoSubmitToken = () => {
    const {values, submitForm} = useFormikContext();
    useEffect(()=>{
        submitForm();
    },[values, submitForm]);
    return null;
}

export default AutoSubmitToken;