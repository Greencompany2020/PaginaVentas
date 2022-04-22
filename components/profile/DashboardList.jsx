import { useState, useEffect } from "react";
import DashboardItem from "./DashboardItem";
import { Accordion } from "../containers";
import { FormModal } from "../modals";
import DashboardForm from "./DashboardForm";
import useToggle from "../../hooks/useToggle";
import { tiendascon } from "../../utils/data";
import { groupBykey} from "../../utils/functions";

const DashboardList = () => {
    const [visible, toggleVisible] = useToggle(false);
    const [selectedData, setData] = useState({});
    const handleSelectedData = (data) => setData(data); 
    const grupos = groupBykey(tiendascon, 'grupo');

    return(
        <>
            <section className="overflow-hidden mt-8 space-y-2">
                {Object.keys(grupos).map((group, groupIndex)=> (
                    <Accordion name={group} key={groupIndex + group}>
                        <div className=" p-4 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(_3,minmax(_200px,_1fr))] gap-10 justify-center">
                           {grupos[group].map((item, index) => (
                               <DashboardItem 
                                    handleSelectedData={handleSelectedData} 
                                    handleToggle={toggleVisible} 
                                    key={index + item} 
                                    data={item}
                               />
                            ))}
                        </div>
                    </Accordion>
                ))}
            </section>

            <FormModal active={visible} handleToggle={toggleVisible}>
                <DashboardForm userValues={selectedData}/>
            </FormModal>
        </>
    )
}

export default DashboardList;