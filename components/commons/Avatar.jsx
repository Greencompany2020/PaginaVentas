import React from 'react';
import Image from 'next/image';
import PropTypes from "prop-types";
import rana from '../../public/images/rana10.png'

export default function Avatar(props) {
    const {urlImage, size} = props;
    return (
        <figure className={`bg-slate-100 rounded-full w-32 h-32 grid place-items-center overflow-hidden`}>
            <Image src={urlImage} width={size} height={size} alt='user avatar' layout='intrinsic'/>
        </figure>
    )
}

Avatar.defaultProps = {
    urlImage: rana,
    size: 124
}

Avatar.propTypes = {
    urlImage: PropTypes.object,
    size: PropTypes.number
}