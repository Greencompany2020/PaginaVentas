import ApiProvider from "./ApiProvider";

export async function getListaArchivos(fileDir) {
  try {
    
    if (!fileDir || fileDir === "minutas" || fileDir === "uploads") fileDir = "uploads";
    else if (fileDir.split("/").length !== 0) {
      const listDirectorio = fileDir.split("/");
      listDirectorio.shift()
      fileDir = listDirectorio.join("/");
    }
    
    const { data } = await ApiProvider.get("/minutas/archivos", {
      params: {
        fileDir
      }
    });
    return data;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function crearDirectorio(dirData) {
  try {
    await ApiProvider.post("/minutas/directorio", dirData);
    return true;
  } catch (error) {
    console.log(error?.response?.data);
    return false;
  }
}

export async function crearMinuta(minutaData, fileDir) {
  try {
    await ApiProvider.post("/minutas/archivos", minutaData, {
      params: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    console.log(error?.response?.data);
    return false;
  }
}

export async function eliminarDirectorio(fileDir) {
  try {
    await ApiProvider.delete("/minutas/directorio", {
      data: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    console.log(error?.response?.data);
    return false;
  }
}

export async function eliminarMinuta(fileDir) {
  try {
    await ApiProvider.delete("/minutas/archivos", {
      data: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    console.log(error?.response?.data);
    return false;
  }
}
