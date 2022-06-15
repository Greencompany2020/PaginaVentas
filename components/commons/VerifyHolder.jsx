import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import Verify from "../../public/icons/ok-08.png";

export default function VerifyHolder(props) {
    const {placeholder} = props
    return (
        <figure className="relative">
            <input
            type="text"
            className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold w-full placeholder:truncate"
            disabled
            placeholder={placeholder}
            />
            <span className=" absolute top-1 right-0">
                <Image src={Verify} height={30} width={30} alt="OK" />
            </span>
        </figure>
    )
}

VerifyHolder.defaultProps={
    placeholder: 'description....'
}

VerifyHolder.propTypes={
    placeholder: PropTypes.any
}
