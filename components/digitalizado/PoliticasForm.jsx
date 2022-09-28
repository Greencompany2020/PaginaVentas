import React, { useEffect, useState, useRef } from 'react';
import { Formik } from 'formik';
import { SelectInput, TextInput, TextAreaInput } from '../FormInputs';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../notifications/NotificationsProvider';
import Select from 'react-select';
import { v4 } from 'uuid';
import * as Yup from 'yup';

export default function PoliticasForm({ item, handleAdd, handleUpdate, opt = 1 }) {

    const service = digitalizadoService();
    const [claves, setClaves] = useState(null);
    const [empresas, setEmpresas] = useState(null)
    const sendNotification = useNotification();
    const selectRef = useRef(null);
    const fileRef = useRef(null);


    useEffect(() => {
        (async () => {
            try {
                const responseClaves = await service.getClaves();
                const responseEmpresas = await service.getEmpresas();
                setClaves(responseClaves);
                setEmpresas(responseEmpresas);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error?.response?.message || error?.message
                });
            }
        })()
    }, []);

    const SUPPORTED_FORMAT = 'application/pdf'

    const initialValues = {
        clave: item?.clave || claves ? claves[0].claves : '',
        descripcion: (opt == 1) ? item?.descripcion || '' : '',
        fechaAut: (opt == 1) ? item?.fechaCarga || '' : '',
        fechaVig: (opt == 1) ? item?.fechaVigencia || '' : '',
        empresa: '',
        file: ''
    }


    const validationSchema = Yup.object().shape({
        clave: !item && Yup.string().required("Requerido"),
        descripcion: !item && Yup.string().required("Requerido"),
        fechaAut: Yup.date("formato no valido").required("Requerido"),
        fechaVig: Yup.date("formato no valido").required("Requerido"),
        empresa: !item && Yup.array().required("Requerido"),
        file: Yup.mixed().required("Requerido").test("fileFormat", "El archivo tiene que ser pdf", value => value && SUPPORTED_FORMAT.includes(value.type))
    })

    const handleOnSubmit = async (values, actions) => {
        try {
            const formData = new FormData();
            if (item && opt == 1) {
                formData.append("files", values.file, values.file.name);
                formData.append("fechaAut", values.fechaAut);
                formData.append("fechaVig", values.fechaVig);
                await handleUpdate(item.id, formData);
            }
            else if (item && opt == 2) {
                formData.append("clave", item.clave);
                formData.append("files", values.file, values.file.name);
                formData.append("fechaAut", values.fechaAut);
                formData.append("fechaVig", values.fechaVig);
                formData.append("empresa", values.empresa.toString());
                await handleAdd(formData);
            }
            else {
                formData.append("clave", values.clave);
                formData.append("descripcion", values.descripcion);
                formData.append("fechaAut", values.fechaAut);
                formData.append("fechaVig", values.fechaVig);
                formData.append("files", values.file, values.file.name);
                formData.append("empresa", values.empresa.toString());
                await handleAdd(formData);
            }
            actions.resetForm();
            selectRef.current.clearValue()
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error?.message
            });
        }
    }


    return (
        <div className="w-[20rem] h-[35rem] md:w-[50rem] md:h-fit relative">
            <Formik
                initialValues={initialValues}
                onSubmit={handleOnSubmit}
                validationSchema={validationSchema}
                enableReinitialize
                render={({ handleSubmit, setFieldValue, errors, touched, }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <section className="md:flex-1">
                                    <fieldset className="space-y-2">
                                        <SelectInput label={"Claves"} name={"clave"} id={"clave"} disabled={(item) ? true : false}>
                                            {
                                                claves &&
                                                claves.map(item => (
                                                    <option value={item.claves} key={v4()}>{item.claves}</option>
                                                ))
                                            }
                                        </SelectInput>
                                        <TextAreaInput label={"Descripcion"} name={"descripcion"} id={"descripcion"} disabled={(item && opt == 1) ? true : false} />
                                        <TextInput label={"Fecha de Autorizacion"} type={"date"} name={"fechaAut"} id={"fechaAut"} />
                                        <TextInput label={"Inicio Vigencia"} type={"date"} name={"fechaVig"} id={"fechaVig"} />
                                    </fieldset>
                                </section>


                                <section className="mt-4 md:flex-1">
                                    <fieldset className="space-y-2">
                                        <label className='flex flex-col font-semibold text-sm  text-gray-600'>
                                            <span>Archivos</span>
                                            <input type="file" name="file" id="file" ref={fileRef} onChange={event => {
                                                setFieldValue("file", event.currentTarget.files[0])
                                            }} />
                                            {(errors.file && touched.file) && <span className='font-semibold text-red-500 text-right'>{errors.file}</span>}
                                        </label>

                                        <label className='flex flex-col font-semibold text-sm  text-gray-600' htmlFor='empresa'>
                                            <span>Empresas</span>
                                            <Select
                                                ref={selectRef}
                                                options={
                                                    empresas &&
                                                    empresas.map(item => ({ value: item.id, label: item.nombre }))
                                                } isMulti
                                                name='empresa'
                                                onChange={option => setFieldValue("empresa", option.map(item => (item.value)))}
                                                isDisabled={(item && opt == 1) ? true : false}
                                            />
                                        </label>
                                    </fieldset>
                                </section>
                            </div>
                            <div className="fixed bottom-2 right-2 md:static md:mt-8 space-x-2 flex justify-end">
                                <input type="reset" value="Cancelar" className="secondary-btn w-24" />
                                <input type="submit" value="Guardar" className="primary-btn w-24" />
                            </div>
                        </form>
                    )
                }}
            />
        </div>
    )

}

