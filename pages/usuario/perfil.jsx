import React from 'react'
import { getBaseLayout } from "../../components/layout/BaseLayout";
import withAuth from "../../components/withAuth";
import useToggle from "../../hooks/useToggle";
import Dropzone from "../../components/dropzone";
import Avatar from "../../components/commons/Avatar";
import { FormModal } from "../../components/modals";
import VerifyHolder from "../../components/commons/VerifyHolder";
import ConfigurationItems from "../../containers/profile/ConfigurationItems";
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import LoaderComponentBas from '../../components/LoaderComponentBas';
import {useSelector, useDispatch} from 'react-redux';
import { setUser } from '../../redux/reducers/userSlice';
import { handleProgress } from '../../redux/actions/notificationSystem';

const Perfil = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const progress = handleProgress();
  

  const [visible, setVisible] = useToggle(false);
  const sendNotification = useNotification();
  const [isLoading, setLoading] = useToggle(false);
  const service = userService();

  const handleUploadImage = async (files) =>{
    setVisible();
    try {
      const response =  await service.updateUserAvatar(files, progress.handle);
      dispatch(setUser(response));
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:error.message
      });
    }
    return true
  }

  const handleRequestNewPassword = async () => {
    setLoading();
    try {
      await service.requestPasswordReset({email:user?.Email});
      sendNotification({
        type:'OK',
        message:'Se ha enviado un link a su correo'
      })
    } catch (error) {
      sendNotification({
        type:'OK',
        message:'Error al enviar correo'
      })
    }
    setLoading();
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-full">
          <section className="w-full h-[500px] md:w-[400px] md:h-full bg-gray-200">
            <div className="p-4">
              <div className="flex flex-col items-center md:justify-center space-y-2">
                <figure className='w-[12rem] h-[12rem]'>
                  <Avatar image={user.ImgPerfil}/>
                </figure>
                <button className="text-blue-400 font-bold" onClick={setVisible}>Cambiar imagen</button>
              </div>
              <div className="mt-8">
              <h4 className="text-xl font-bold">Inicio de sesion</h4>
                <div className="mt-3 space-y-2">
                  <p className="font-semibold">Email y contraseña</p>
                  <VerifyHolder placeholder={user?.Email}/>
                  <button className="text-blue-400 font-bold" onClick={handleRequestNewPassword}>Cambiar Contraseña</button>
                  <LoaderComponentBas isLoading={isLoading}/>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full md:h-full">
           <div className="p-4">
              <h4 className=" hidden md:block md:text-right md:text-2xl md:font-bold">{user?.Nombre} {user?.Apellidos}</h4>
              {/*Informacion*/}
              <section>
                <h3 className="text-xl font-semibold mb-2">Informacion general</h3>
                <div className="grid gap-4 md:grid-cols-6 pl-2">

                  <div className="flex flex-col space-y-2">
                      <label>Empleado</label>
                      <VerifyHolder placeholder={user?.NoEmpleado}/>
                  </div>

                  <div className="flex flex-col space-y-2 md:col-span-3">
                    <label htmlFor="">Nombre</label>
                    <input
                      type="text"
                      placeholder={`${user?.Nombre} ${user?.Apellidos}`}
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="">Level</label>
                    <input
                      type="text"
                      placeholder={user?.Level}
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="">Clase</label>
                    <input
                      type="text"
                      placeholder={user?.Clase}
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor=""> F.ingreso</label>
                    <input
                      type="text"
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-2 md:col-span-3">
                    <label htmlFor="">Usuario</label>
                    <input
                      type="text"
                      placeholder={user?.UserCode}
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                  <div className="flex flex-col space-y-2 md:col-span-2">
                    <label htmlFor="">Grupo</label>
                    <input
                      type="text"
                      placeholder={user?.NombreGrupo}
                      className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
                      disabled
                    />
                  </div>

                </div>
              </section>
              
              {/*Configuraciones*/}
              <section className="mt-8 mb-24 md:mb-0">
                <h3 className="text-xl font-semibold mb-2">Configuraciones</h3>
                <ConfigurationItems/>
              </section>

           </div>
          </section>
      </div>

      {/*Modals*/}
      <FormModal active={visible} handleToggle={setVisible} name="Subir imagenes">
        <div className=" p-4 h-[22rem] md:h-[22rem] md:w-[42rem]">
          <Dropzone uploadFunction={handleUploadImage} label='Arrastra la imagen o presiona aqui'/>
        </div>
      </FormModal>
    </>
  );
};

const PerfilWithAuth = withAuth(Perfil);
PerfilWithAuth.getLayout = getBaseLayout;
export default PerfilWithAuth;
