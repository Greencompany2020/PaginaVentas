import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import('./PDFVisor'), {
    ssr: false,
})

export default function PDF(props){
    return <PDFViewer {...props}/>
}