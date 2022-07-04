import React from 'react';
import PropTypes from "prop-types";
import { v4 } from 'uuid';

export default function Stats(props) {
    return (
        <article className=' border rounded-md p-2 w-full space-y-1'>
            <h4 className='text-sm font-semibold'>{props.title}</h4>
                <section className={`grid grid-cols-${props.columnNum} gap-x-4 gap-y-8 place-items-center xl:place-items-stretch items-start`}>
                {
                    (()=>{
                        if(props.columns){
                            const Items = props.columns.map(item => {
                                if(Object.keys(item).length > 0) return <Column key={v4()} item={item}/>;
                                return null;
                            });
                            return Items;
                        }
                    })()
                }
               </section>
        </article>
    )
}

const Column = ({item}) => (
    <div className='space-y-1 w-full'>
        <h5 className='text-xs font-semibold text-blue-500 truncate'>{item.columnTitle}</h5>
        <div className='space-y-1'>
            {
                (()=>{
                    if(item.values){
                        const Items = item.values.map(el => (
                            <div key={v4()} className='flex justify-between space-x-2'>
                                <p className='flex-1 font-bold text-xs text-left'>{el.caption}</p>
                                <p className='flex-[2] text-xs text-right'>{el.value}</p>
                            </div>
                        ))
                        return Items;
                    }
                })()
            }
        </div>
    </div>
)

Stats.defaultProps = {
    columnNum: 3,
}

Stats.proptypes = {
    title: PropTypes.string,
    columnNum: PropTypes.number,
    columns: PropTypes.arrayOf(PropTypes.exact({
        columnTitle: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.exact({
            caption: PropTypes.string,
            value: PropTypes.object,
            rule: PropTypes.string
        }))
    }))
}
