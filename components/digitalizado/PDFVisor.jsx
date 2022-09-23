import React, { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Document, Page, pdfjs } from 'react-pdf';
import { v4 } from 'uuid';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


export default function PDFVisor({ items, visible, setVisible }) {
  const [numPages, setNumePages] = useState(null);
  const [selected, setSelected] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumePages(numPages)
  };


  useEffect(() => {
    if (items) {
      if (Array.isArray(items)) setSelected(items[0]);
      else setSelected(items);
    }
  }, [items])


  return (
    <>
      <div className={`modal-visor-pdf ${visible && 'active'} noprint`}>

        <div className='modal-visor-pdf-header'>
          <XIcon width={28} onClick={setVisible} className=" text-gray-500" />
        </div>

        <div className="overflow-auto h-full">
          <div className="flex flex-col  md:flex-row relative">
            <section className='p-2'>
              <div className='flex flex-row space-x-2 md:flex-col md:space-y-2 md:space-x-0'>
                {
                  (items && Array.isArray(items)) &&
                  items.map(item => (
                    <button
                      key={v4()}
                      className="secondary-btn w-32  truncate"
                      onClick={() => setSelected(item)}
                    >{item.clave}</button>
                  ))
                }
              </div>
            </section>

            <section className='modal-visor-pdf-body'>
              <Document file={selected?.url} onLoadSuccess={onDocumentLoadSuccess} className="bg-red-50">
                {Array.from({ length: numPages }, (_, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                ))}
              </Document>
            </section>
          </div>
        </div>
      </div>

      {/*Overlay*/}
      <div className={`${!visible && 'hidden'}  fixed top-0 right-0 w-screen min-h-screen bg-gray-500 z-10 opacity-80`} />
    </>

  )
}

