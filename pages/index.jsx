import Head from "next/head";
import Image from "next/image";
import Logo from "../public/images/green-company.png";
import { useState } from "react";
import witAuth from "../components/withAuth";
import LoaderComponentBas from "../components/LoaderComponentBas";
import LoginContainer from "../containers/login/LoginContainer";
import ResetPasswordContainer from "../containers/login/ResetPasswordContainer";
import useToggle from "../hooks/useToggle";

export const Home = () => {
  const [attemptLogin, setAttemp] = useState(true);
  const [isLoading, setLoading] = useToggle(false);

  return (
    <>
      <Head>Ventas</Head>
      <section className="h-screen bg-cyan-600 grid place-items-center p-3">
        <div className="bg-gray-200  rounded-md p-3">
          <div className="flex flex-col justify-center p-4">
            <div className=" w-2/3 m-auto mb-1">
              <Image
                src={Logo}
                alt="Green Company"
                className=" object-fill h-40"
              />
            </div>
            {attemptLogin ? <LoginContainer setLoading = {setLoading}/> : <ResetPasswordContainer setLoading = {setLoading}/>}
            <LoaderComponentBas isLoading={isLoading} />
            <button 
              className="text-lg cursor-pointer text-sky-500 text-center mt-8 font-semibold"
              onClick={() => setAttemp(prev => !prev)}
            >{attemptLogin ? 'Olvide mi contraseña' : 'Regresar'}</button>
          </div>
        </div>
      </section>
    </>
  );
};

export default witAuth(Home);
