import React, { useCallback, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useDropzone } from "react-dropzone";
import uploadImage from '../../public/images/upload.png';
import Image from "next/image";


export default function Dropzone(props) {

  const {label, allowFiles, handleUpload} = props;
  const [preview, setPreview] = useState(undefined);
  const [files, setFiles] = useState(undefined);

  const handleOnUpload = async () =>{
    if(Array.isArray(files)){
     const response = await handleUpload(files);
      if(response){ 
        setFiles(undefined);
        setPreview(undefined);
      }
    }
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setPreview(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const deletePress = (item) => {
    if(Array.isArray(files)){
      const filtered = files.filter(prev => prev !== item);
      setFiles(filtered);
      setPreview(filtered)
    }
  }

  const { 
    getRootProps, 
    getInputProps, 
    isDragAccept, 
    isDragReject,
    isFocused, 
  } = useDropzone({ onDrop,accept: {'image/*': []}, maxFiles:allowFiles });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);


  const selected_images = preview?.map((file, index) => (
      <figure key={index} style={contentFigure}>
        <img 
          src={file.preview} 
          style={{ width: "110px", height:'110px' }} 
          alt="image preview"
          onClick={() => deletePress(file)} 
        />
      </figure>
  ));

  return (
    <div>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <div style={{display: 'flex', alignItems:'center'}}>
          <Image src={uploadImage} width={90} height={90} alt='upload' layout="fixed"/>
          <p style={{textAlign:'center', marginLeft:'0.5rem'}}>{label}</p>
        </div>
      </div>
      <div style={{display:'flex', justifyContent:'center'}}>
        <button style={buttonStyle} onClick={ handleOnUpload}>Subir</button>
      </div>
      <div style={previewContent}>
        {selected_images}
      </div>
    </div>
  );
}

Dropzone.defaultProps = {
  allowFiles:1,
  label: 'Drop your files or tap here',
};

Dropzone.propTypes = {
  allowFiles: PropTypes.number,
  label: PropTypes.string,
  handleUpload: PropTypes.func,
};

const baseStyle = {
  display:'grid',
  placeItems: 'center',
  height:"8rem",
  flexDirection: "column",
  padding: "5px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#cacaca",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const previewContent = {
  display: 'flex',
  flex:1,
  flexDirection:'row',
  marginTop:'0.9rem'
}

const contentFigure = {
  position: 'relative',
  padding: '0.4rem',
  backgroundColor:'#eeeeee',
  borderRadius:'0.3rem',
  display: 'flex',
  justifyContent:'center',
  marginLeft: '1em'
}

const buttonStyle = {
  marginTop:"0.5rem",
  width: "12rem",
  height: "2rem",
  borderRadius:"0.3rem",
  backgroundColor: "#0ea5e9",
  color:"#fff",
  fontWeight: "bold",
}
