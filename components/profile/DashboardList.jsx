import { useState} from "react";
import DashboardItem from "./DashboardItem";
import { Accordion } from "../containers";
import { FormModal } from "../modals";
import DashboardForm from "./DashboardForm";
import useToggle from "../../hooks/useToggle";
import { groupBykey} from "../../utils/functions";

const DashboardList = ({dashboards}) => {


    const [visible, toggleVisible] = useToggle(false);
    const [selectedData, setData] = useState({});
    const handleSelectedData = (data) => setData(data); 

    
    const DisplayItems = ({dashboards}) => {
        if(!dashboards) return <></>
        const grupos = groupBykey(dashboards, 'Clase');
        const Items = Object.keys(grupos).map((group, groupIndex)=> (
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
        ));
        return Items;
    }

    return(
        <>
            <section className="overflow-hidden mt-8 space-y-2">
                <DisplayItems dashboards={dashboards}/>
            </section>

            <FormModal active={visible} handleToggle={toggleVisible}>
                <DashboardForm userValues={selectedData}/>
            </FormModal>
        </>
    )
}

export default DashboardList;