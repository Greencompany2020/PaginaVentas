import Image from "next/image";
import logo from "../public/images/brand.svg";
import { useState } from "react";
import LoaderComponentBas from "../components/LoaderComponentBas";
import LoginContainer from "../containers/login/LoginContainer";
import ResetPasswordContainer from "../containers/login/ResetPasswordContainer";
import useToggle from "../hooks/useToggle";
import withAuth from "../components/withAuth";

export const Home = () => {
  const [attemptLogin, setAttemp] = useState(true);
  const [isLoading, setLoading] = useToggle(false);

  return (
   <section className=" h-screen grid place-items-center bg-cyan-600 p-4">
      <div className="w-5/6  sm:w-4/12   xl:w-2/12  p-4 shadow-sm shadow-slate-800 bg bg-gray-50 rounded-md">
        <figure className="relative w-full h-36 ">
          <Image src={logo} layout='fill' alt="logo"/>
        </figure>
        <div>
          {attemptLogin ? <LoginContainer setLoading = {setLoading}/> : <ResetPasswordContainer setLoading = {setLoading}/>}
          <LoaderComponentBas isLoading={isLoading} />
        </div>
        <button 
          className=" w-full text-sm font-bold text-sky-500 mt-8"  
          onClick={() => setAttemp(prev => !prev)}
        >
         {attemptLogin ? 'Olvide mi contraseña' : 'Regresar'}
        </button>
      </div>
   </section>
  );
};

export default withAuth(Home);
