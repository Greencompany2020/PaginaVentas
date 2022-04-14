import DashboardItem from "./DashboardItem";
import { Accordion } from "../containers";
import { FormModal } from "../modals";

const DashboardList = () => {
    return(
        <>
            <section className="overflow-hidden overflow-y-scroll">
                <Accordion>
                <div className=" p-4 w-full grid grid-cols-1 md:grid-cols-3 gap-10 justify-center">
                    <DashboardItem/>
                    <DashboardItem/>
                    <DashboardItem/>
                </div>
                </Accordion>
            </section>
            <FormModal>
                <div>
                    hola
                </div>
            </FormModal>
        </>
    )
}

export default DashboardList;