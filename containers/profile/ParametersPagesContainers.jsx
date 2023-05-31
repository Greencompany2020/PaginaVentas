import { useEffect, useState } from "react"
import { Form, Formik } from "formik";
import { SelectInput } from "../../components/FormInputs";
import userService from "../../services/userServices";
import { useNotification } from "../../components/notifications/NotificationsProvider";

export default function ParametersPageContainer() {
    const service = userService();
    const sendNotification = useNotification();
    const [values, setValues] = useState({
        confirmShippingList: 'CM',
    });

    const getGlobarParameters = async () => {
        const {confirmGlobalShippingList} = await service.getGlobalParameters();
        setValues({ 
            confirmShippingList:confirmGlobalShippingList ?? values.confirmShippingList, 
        })
    }

    const onSubmitGlobals = async (values) => {
        try {
            const response = await service.updateGlobalParameters(values);
            if(response){
                sendNotification({
                    type: 'OK',
                    message: 'Datos actualizados'
                })
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            })
        }
    }

    useEffect(() => {
        getGlobarParameters();
    }, [])

    return (
        <div>
            <Formik initialValues={values} onSubmit={onSubmitGlobals} enableReinitialize>
                <Form>
                    <fieldset className="space-y-2">
                        <SelectInput label={"Metodo de confirmacion de embarque"} name='confirmShippingList'>
                            <option value={"CM"}>Confirmacion manual</option>
                            <option value={"CB"}>Confirmar por bulto</option>
                            <option value={"CE"}>Confirmar por embarque</option>
                        </SelectInput>
                    </fieldset>

                    <div className="flex flex-row justify-end space-x-2 mt-6 ">
                        <input type='reset' value='Cancelar' className="secondary-btn w-28" />
                        <input type='submit' value='Guardar' className="primary-btn w-28" />
                    </div>
                </Form>
            </Formik>
        </div>
    )
}