import reporteProvider from "./providers/reporteProvider";

export async function getListaArchivos(fileDir) {
  try {
    
    if (!fileDir || fileDir === "minutas" || fileDir === "uploads") fileDir = "uploads";
    else if (fileDir.split("/").length !== 0) {
      const listDirectorio = fileDir.split("/");
      listDirectorio.shift()
      fileDir = listDirectorio.join("/");
    }
    
    const { data } = await reporteProvider.get("/minutas/archivos", {
      params: {
        fileDir
      }
    });
    return data;
  } catch (error) {
    return error;
  }
}

export async function crearDirectorio(dirData) {
  try {
    await reporteProvider.post("/minutas/directorio", dirData);
    return true;
  } catch (error) {
    return error;
  }
}

export async function crearMinuta(minutaData, fileDir) {
  try {
    await reporteProvider.post("/minutas/archivos", minutaData, {
      params: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    return error;
  }
}

export async function eliminarDirectorio(fileDir) {
  try {
    await reporteProvider.delete("/minutas/directorio", {
      data: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    return error;
  }
}

export async function eliminarMinuta(fileDir) {
  try {
    await reporteProvider.delete("/minutas/archivos", {
      data: {
        fileDir
      }
    });
    return true;
  } catch (error) {
    return error;
  }
}
