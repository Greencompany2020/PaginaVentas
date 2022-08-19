import React from 'react';
import PropTypes from "prop-types";
import { v4 } from 'uuid';

export default function Stats(props) {

    
    const Columns = () => {
        if (props.columns) {
            return props.columns.map(col => {
                if (col) {
                    return (
                        <div key={v4()} className='space-y-1 w-full'>
                            <h5 className='text-xs font-semibold text-blue-500 truncate'>{col.columnTitle}</h5>
                            <div className='space-y-1'>
                                {
                                    col.values.map(item => (
                                        <div key={v4()} className='flex justify-between space-x-2'>
                                            <p className='flex-1 font-bold text-xs text-left'>{item?.caption}</p>
                                            <p className='flex-[2] text-xs text-right'>{item?.value}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            });
        }
        return null
    }

    return (
        <article className='border rounded-md p-2 w-full space-y-1'>
            <h4 className='text-sm font-semibold'>{props?.title || ''}</h4>
            <section className={`grid ${props?.expand ? 'grid-cols-2' : 'grid-cols-3'} gap-x-4 gap-y-8 place-items-center xl:place-items-stretch items-start`}>
            <Columns/>
            </section>
        </article>
    )
}



Stats.defaultProps = {
    expand: false,
}

Stats.proptypes = {
    title: PropTypes.string,
    expand: PropTypes.bool,
    columns: PropTypes.arrayOf(PropTypes.exact({
        columnTitle: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.exact({
            caption: PropTypes.string,
            value: PropTypes.object,
            rule: PropTypes.string
        }))
    }))
}
