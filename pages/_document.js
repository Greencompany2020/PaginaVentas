import { Html, Main, NextScript,Head, } from 'next/document'

export default function Document(){
    return(
        <Html lang='es'>
            <Head>
                <meta charSet='UTF-8'/>
                <meta name='description' content='Pagina de reportes corporativos'/>
                <meta name='author' content='Grupo serigrafico'/>
                <meta name='robots' content='noindex, nofollow' />
                <title>Pagina de ventas</title>
            </Head>
            <body>
                <Main/>
                <NextScript/>
            </body>
        </Html>
    )
}