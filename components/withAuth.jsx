import { post_accessTo } from "../services/AuthServices";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { useEffect, useState } from "react";
import LoaderComponent from "./Loader";
const witAuth = (Component) => {
  const AuthorizationComponent = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    /**
     * paginas con reglas expeciales
     */
    const exceptions = [
      {
        pathname: "/",
        tokenRequired: false,
      },
      {
        pathname: "/dashboard",
        tokenRequired: true,
      },
      {
        pathname: "/usuario/perfil",
        tokenRequired: true,
      },
      {
        pathname: "/ventas",
        tokenRequired: true,
      },
      {
        pathname: "/unauthorized",
        tokenRequired: true,
      },
    ];

    /**
     * callback que redirige la pagina
     * @param {*} page
     * @param {*} opt
     */
    const redirecTo = (page, opt = "push") => {
      switch (opt) {
        case "replace":
          router.replace(page);
          break;
        case "push":
          router.push(page);
          break;
        default:
          router.push(page);
          break;
      }
    };

    /**
     * Evalua si el usuario tiene tiene un token de acceso
     * Si lo tiene y esa expirado tratara de refrescarlo
     * @returns boolean
     */
    const userHastoken = () => {
      const token = cookie.get("accessToken");
      const isTokenAvailable = token ? true : false;
      return isTokenAvailable;
    };

    /**
     * Evalua si el usuario tiene permisos para ingresar al point
     * @returns data
     */
    const getAuthToPath = async () => {
      const data = post_accessTo(router.asPath);
      return data;
    };
    /**
     * si el usuario no esta autorizado remplaza la direccion
     * si el usuario no tiene token lo redirecciona al login
     * si el usuario tiene token y quiere ingresar al login lo redirige al dashboard
     * @returns
     */
    const pathEvaluate = async () => {
      const attemptException = exceptions.find(
        (paths) => paths.pathname == router.asPath
      );
      const userToken = userHastoken();
      if (attemptException) {
        if (attemptException.tokenRequired && !userToken)
          redirecTo("/", "push");
        if (attemptException.pathname == "/" && userToken)
          redirecTo("/dashboard", "push");
        setLoading(false);
      } else {
        if (!userToken) redirecTo("/", "push");
        const userAccess = await getAuthToPath();
        if (!userAccess.access) return redirecTo("/unauthorized", "replace");
        setLoading(false);
      }
    };

    useEffect(() => {
      pathEvaluate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? <LoaderComponent /> : <Component />;
  };

  /**
   * Este procedimiento solo se ejecuta desde el servidor
   * @param {*} req
   * @param {*} res
   * @returns
   */

  AuthorizationComponent.getInitialProps = async ({ req, res }) => {
    if (req && res) {
      const { url } = req;
      const { accessToken } = req.cookies;

      if (url !== "/" && !accessToken) {
        res.writeHead(302, {
          location: "/",
        });
        res.end();
      } else if (url == "/" && accessToken) {
        res.writeHead(302, {
          location: "/dashboard",
        });
        res.end();
      }
    }
    /**
     * ¯\_(ツ)_/¯
     */
    return { nothingToseeHere: "yay" };
  };

  return AuthorizationComponent;
};

export default witAuth;

