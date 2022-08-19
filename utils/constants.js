/**
* paginas con reglas expeciales   
*/
export const urlExceptions = [
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
]