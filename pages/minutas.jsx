import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MinutasButton } from '../components/buttons';
import { Flex } from '../components/containers';
import { ConfirmModal} from "../components/modals";
import { crearDirectorio, crearMinuta, eliminarDirectorio, eliminarMinuta, getListaArchivos } from '../services/MinutasService';
import Chat from '../public/icons/chat.svg';
import Refresh from '../public/icons/refresh.svg';
import Home from '../public/icons/home.svg';
import Folder from '../public/images/folder-icon.png';
import Question from '../public/images/question.png';
import Trash from '../public/images/trash-icon.png';
import Close from '../public/icons/close.svg';
import { isError } from '../utils/functions';
import withAuth from '../components/withAuth';
import { getVentasLayout } from '../components/layout/VentasLayout';
import { useNotification } from '../components/notifications/NotificationsProvider';

const Minutas = () => {
  const [carpetasArchivos, setcarpetasArchivos] = useState({
    carpetas: 0,
    archivos: 0
  });
  const fileInputRef = useRef(null);
  const [directorioActual, setDirectorioActual] = useState("minutas");
  const [fileDir, setFileDir] = useState("");
  const [minutas, setMinutas] = useState([]);
  const [tipo, setTipo] = useState("carpeta");
  // Estados modal
  const confirmModalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const sendNotification = useNotification();

  const handleModal = () => {
    setFileDir("");
    if (tipo === "minuta")
      fileInputRef.current.value = "";
    setShowModal(!showModal);
  }

  const handleCarpetaButton = () => {
    setShowModal(!showModal);
    setTipo("carpeta");
  }

  const handleMinutaButton = () => {
    setShowModal(!showModal);
    setTipo("minuta");
  }

  // Eliminar un directorio o archivo
  const handleDelete = async (dir, type) => {
    const confirm = await confirmModalRef.current?.show()

    let result = null;

    if (type === "directory") {
      sendNotification({
        type:'OK',
        message: "Se ha eliminado la carpeta"
      });
      result = await eliminarDirectorio(dir);
    } else {
      sendNotification({
        type:'OK',
        message: "Se ha eliminado la minuta"
      });
      result = await eliminarMinuta(dir);
    };


    if (!confirm) return;

    if (result && !isError(result)) {
      const nuevasMinutas = await getListaArchivos(directorioActual);
      setTimeout(() => {
        setShowModal(false);
        setMinutas(nuevasMinutas);
      }, 2000);
    } else {
      sendNotification({
        type:'ERROR',
        message: result?.response?.data?.message ?? "No se pudo eliminar"
      })
    }
  }

  // Regresar a la carpeta raiz
  const handleRaizButton = () => {
    setDirectorioActual("minutas");
    getListaArchivos()
      .then(response => {
        if (isError(response)) {
          sendNotification({
            type: 'ERROR',
            message: response?.response?.data?.message ?? "No se pudieron obtener las minutas. Consulte la consola (F12) para más detalles"
          })
        } else {
          setMinutas(response)
        }
      });
  }


  // Crear carpeta y añadir minuta
  const submitHandler = async (e) => {
    e.preventDefault();

    if (tipo === "carpeta") {
      let listaDirectorios = directorioActual.split("/");
      listaDirectorios.shift();
  
      const newDirectorio = {
        dir: "",
        dirBase: ""
      }
  
      if (!fileDir) {
        sendNotification({
          type: 'ERROR',
          message: "Ingrese un nombre para la carpeta"
        })
        return;
      }

      newDirectorio.dir = fileDir;
  
      if (listaDirectorios.length === 0) {
        newDirectorio.dirBase = "uploads";
      } else {
        newDirectorio.dirBase = listaDirectorios.join("/");
      }
  
      const result = await crearDirectorio(newDirectorio);

      if (result && !isError(result)) {
        const nuevasMinutas = await getListaArchivos(directorioActual);
        
        sendNotification({
          type: 'OK',
          message: "Se ha creado la carpeta"
        })
      
        setTimeout(() => {
          setFileDir("");         
          setShowModal(false);
          setMinutas(nuevasMinutas);
        }, 2000);
      } else {
        sendNotification({
          type: 'ERROR',
          message: result?.response?.data?.message ?? "No se pudo crear la carpeta"
        })
      }
    } else {
      if (fileInputRef.current.files.length === 0) {
        sendNotification({
          type: 'ERROR',
          message:"Seleccione archivos a subir"
        })
        return;
      }

      let listaDirectorios = directorioActual.split("/");
      listaDirectorios.shift();

      const fileDirParam = "";

      if (listaDirectorios.length === 0) {
        fileDirParam = "uploads";
      } else {
        fileDirParam = listaDirectorios.join("/");
      }

      const formData = new FormData();

      for (const key of Object.keys(fileInputRef.current.files)) {
        formData.append("files", fileInputRef.current.files[key]);
      }
      
      const result = await crearMinuta(formData, fileDirParam);
      
      if (result && !isError(result)) {
        const nuevasMinutas = await getListaArchivos(directorioActual);
        sendNotification({
          type: 'OK',
          message:"Se ha(n) añadido la(s) minuta(s)"
        })
        
        setTimeout(() => {
          fileInputRef.current.value = "";          
          setShowModal(false);
          setMinutas(nuevasMinutas);
        }, 2000);
      } else {
        sendNotification({
          type: 'ERROR',
          message: result?.response?.data?.message ?? "No se pudo añadir la minuta"
        })
      }
    }

    
  }
  // Actualizar el directorio
  const handleUpdate = async () => {
    const minutasActualizadas = await getListaArchivos(directorioActual);

    if (isError(minutasActualizadas)) {
      sendNotification({
        type: 'ERROR',
        message: minutasActualizadas?.response?.data?.message ?? "No se pudieron obtener las minutas. Consulte la consola (F12) para más detalles"
      })
    } else {
      setMinutas(minutasActualizadas);
    }

  }

  // Regresa al directorio anterior
  const handlePrevDirectorio = () => {
    if (directorioActual !== "minutas") {
      setDirectorioActual(prevDir => {
        const listaDir = prevDir.split("/");
        listaDir.pop();
        return listaDir.join("/");
      });
    }

  }
  // Navegar por directorio
  const handleDirectorio = (dir) => {
    setDirectorioActual(`minutas/${dir}`);
  }
  // Obtiene la cuenta de directorios y archivos.
  const updateCount = () => {
    let carpetas = 0;
    let archivos = 0;

    carpetas = minutas.filter(item => item.typeItem === "directory").length;
    archivos = minutas.filter(item => item.typeItem === "file").length;
    setcarpetasArchivos({
      carpetas,
      archivos
    })
  }

  useEffect(() => {
    getListaArchivos(directorioActual)
      .then(response => {

        if (isError(response)) {
          sendNotification({
            type: 'ERROR',
            message: response?.response?.data?.message ?? "No se pudieron obtener las minutas. Consulte la consola (F12) para más detalles"
          })
        } else {
          setMinutas(response)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directorioActual]);


  useEffect(() => {
    updateCount(minutas);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutas])

  return (
    <>
      <Flex className="w-full h-full justify-center items-center py-10 relative">
        <Flex className="bg-gray-100 p-1 w-full lg:w-3/5 h-full rounded-lg flex-col overflow-hidden">
          <Flex className="justify-between p-4">
            <h1 className="font-bold text-2xl">Minutas GreenCompany</h1>
            <Image src={Chat} alt='' className="w-9 h-9" height={36} width={36} />
          </Flex>
          <div className="h-5/6 w-full bg-white p-2">
            <Flex className="justify-center sm:justify-end mb-2 flex-wrap">
              {/* Botón Raiz */}
              <MinutasButton onClick={handleRaizButton}>
                <Image src={Home} alt='Home' height={28} width={28} />
                <span className="text-white ml-2">Raíz</span>
              </MinutasButton>
              {/* Botón Crear Carpeta */}
              <MinutasButton onClick={handleCarpetaButton}>
                <Image src={Chat} alt='Dialog' height={28} width={28} />
                <span className="text-white mr-2">+ Carpeta</span>
              </MinutasButton>
              {/* Botón Crear Minuta */}
              <MinutasButton onClick={handleMinutaButton}>
                <Image src={Chat} alt='Dialog' height={28} width={28} />
                <span className="text-white mr-2">+ Minuta</span>
              </MinutasButton>
              <MinutasButton onClick={handleUpdate}>
                <Image src={Refresh} alt='Refresh' height={28} width={28} />
                <span className="text-white mr-2">Actualizar</span>
              </MinutasButton>
              {/* <MinutasButton>
                  <Image src={Menu} alt='' height={28} width={28} />
                  <span className="text-white mr-2">Actualizar</span>
                </MinutasButton> */}
            </Flex>
            <div className="bg-gray-100 w-full p-1 rounded-sm">
              <p><span className="font-bold">Directorio actual:</span> {directorioActual}</p>
            </div>
            {/* TABLA MINUTAS */}
            <table className="bg-gray-100 mt-2 w-full border-2 table-auto">
              <thead>
                <tr className="text-gray-500 font-bold text-lg">
                  <th colSpan={2}>Minuta/Carpeta</th>
                  <th>Tamaño</th>
                  <th>---</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='w-10 p-2 border-2 text-yellow-500'>
                    <Image src={Folder} alt='Folder' className="w-7 h-7 m-auto object-cover" />
                  </td>
                  <td className='border-2 text-left pl-1'>
                    <p className="hover:cursor-pointer" onClick={handlePrevDirectorio}>...</p>
                  </td>
                  <td className='border-2'></td>
                  <td className='border-2'></td>
                  <td className='border-2'></td>
                </tr>
                {
                  minutas?.map(item => (
                    <tr className="text-center" key={item.name}>
                      <td className="w-10 p-2 border-2 text-yellow-500">
                        {item.typeItem === "file" ? <Image src={Question} alt='Unknown' className="m-auto object-contain" height={28} width={28} /> : <Image src={Folder} alt='Dir' className="m-auto object-contain" height={28} width={28} />}
                      </td>
                      <td className="border-2 text-left pl-1">
                        {
                          item.typeItem === "directory" ?
                            (<p className="hover:underline hover:cursor-pointer hover:text-blue-600 w-3" onClick={() => { handleDirectorio(item.path) }}>{item.name}</p>)
                            :
                            (<Link href={item.path}><a target="_blank">{item.name}</a></Link>)
                        }
                      </td>
                      <td className="border-2">
                        {item.size.includes('0') ? '' : item.size}
                      </td>
                      <td className="border-2">
                        ---
                      </td>
                      <td className="border-2 text-blue-600">
                        <Image src={Trash} alt='Trash'
                          className="m-auto object-contain cursor-pointer"
                          height={28}
                          width={28}
                          onClick={() => { handleDelete(item.filePath ?? item.path, item.typeItem) }}
                        />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <Flex>
            <p><span className="font-bold">Carpetas: </span>{carpetasArchivos.carpetas}</p>
            <p className="ml-1"><span className="font-bold">Archivos: </span>{carpetasArchivos.archivos}</p>
          </Flex>
        </Flex>
        {/* MODAL */}
        <div className={`bg-black absolute w-4/5 sm:w-2/3 lg:w-1/3 ${showModal ? 'top-1/4 transform scale-100 transition ease-in-out duration-200' : '-top-1/4 transform scale-0 transition ease-in-out duration-200'} h-20 flex justify-center items-center p-4 rounded-md`}>
          <div className='relative w-full flex'>
            <form className="w-full flex justify-evenly items-center" onSubmit={submitHandler}>
              <Flex className="flex-col flex-grow mr-2">
                <label htmlFor="carpeta" className="text-white">Nueva {tipo === "carpeta" ? "Carpeta" : "Minuta"}</label>
                <input
                  type="text"
                  name="fileDir"
                  className={`rounded-md outline-none h-8 ${tipo === "minuta" && "hidden"}`}
                  value={fileDir}
                  onChange={(e) => { setFileDir(e.target.value) }}
                />
                {
                  tipo === "minuta" && (<input type="file" name="file" multiple className="rounded-md outline-none h-8 text-white" ref={fileInputRef} />)
                }

              </Flex>
              <button className="w-28 self-end text-white rounded-lg bg-sky-500 hover:bg-sky-400 h-8 transition-all ease-in-out duration-200">
                Crear
              </button>
            </form>
            <span className="cursor-pointer ml-5" onClick={handleModal}>
              <Image src={Close} alt="close" height={25} width={25} />
            </span>
          </div>
        </div>
       
      </Flex>
       {/* CONFIRM MODAL */}
        <ConfirmModal ref={confirmModalRef} />
    </>
  )
}

const MinutasWithAuth = withAuth(Minutas);
MinutasWithAuth.getLayout = getVentasLayout;
export default MinutasWithAuth;
