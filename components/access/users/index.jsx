import { useState, useRef } from "react";
import UserTable from "./UserTable";
import Paginate from "../../paginate";
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import UserAccessTable from "./UserAccessTable";
import { FormModal } from "../../modals";
import useToggle from "../../../hooks/useToggle";
import { ConfirmModal } from "../../modals";

export default function Users(props) {
  const {
    data,
    getUserDetail,
    createUser,
    updateUser,
    deleteUser,
    assignAccess,
    groups,
  } = props;

  const confirmModalRef = useRef(null);
  const [itemDetails, setDetails] = useState({});
  const [replacedAccesEnabled, setReplacedAccessEnabled] = useState([]);
  const [visible, toggleVisible] = useToggle();
  const [showAccess, toggleAccess] = useToggle();
  const [modalContent, setmodalContent] = useState({
    target: "",
    item: {},
    title: "",
  });

  const ModalContent = () => {
    const { target } = modalContent;

    if (target === "addUser") {
      return (
        <UserForm
          toggleVisible={toggleVisible}
          handleSubmit={createUser}
          groups={groups}
        />
      );
    }

    if (target === "editUser") {
      return (
        <UserForm
          item={itemDetails}
          toggleVisible={toggleVisible}
          handleSubmit={updateUser}
          groups={groups}
        />
      );
    }
    return <></>;
  };

  const handleOnSelect = async (focused) => {
    if (Object.keys(focused).length > 0) {
      const { Id } = focused;
      const response = await getUserDetail(Id);
      const { userDetail, userAccess } = response;
      setDetails(userDetail);
      setReplacedAccessEnabled(userAccess);
    }
  };

  const getUpdateAccess = async () => {
    const { Id } = itemDetails;
    const response = await getUserDetail(Id);
    const { userAccess } = response;
    setReplacedAccessEnabled(userAccess);
  };

  const handleModalContent = (target, title, item = null) => {
    if (!visible) {
      setmodalContent({
        target,
        item,
        title,
      });
      toggleVisible();
    }
  };

  const handleDeleteUser = async (id) => {
    const confirm = await confirmModalRef.current.show();
    if (confirm) deleteUser(id);
  };

  const handleAssignAccess = async (idDashboard, enabled) => {
    console.log(itemDetails);
    if (Object.keys(itemDetails).length > 0) {
      const idUser = itemDetails.Id;
      const replacedEnabled = enabled == true ? "N" : "Y";
      const body = {
        idDashboard,
        idUser,
        enabled: replacedEnabled,
      };
      await assignAccess(body);
      await getUpdateAccess();
    }
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <UserInfo item={itemDetails} />
        <div className="mt-4 mb-4 md:mb-4 flex justify-start">
          <button
            className="primary-btn w-20"
            onClick={() => handleModalContent("addUser", "Agregar usuario")}
          >
            Agregar
          </button>
        </div>
        <section className="h-full">
          <Paginate
            data={data}
            showItems={5}
            options={{
              labelSelector: "Mostrar",
              optionRange: [20, 50, 100],
              searchBy: ["Nombre", "UserCode", "NoEmpleado"],
            }}
          >
            <UserTable
              handleOnSelect={handleOnSelect}
              handleModalContent={handleModalContent}
              handleDeleteUser={handleDeleteUser}
              toggleAccess={toggleAccess}
            />
          </Paginate>
        </section>
      </div>

      <FormModal
        key={546454}
        name={modalContent.title}
        active={visible}
        handleToggle={toggleVisible}
      >
        <ModalContent />
      </FormModal>

      <FormModal
        key={12333}
        name="Accesos de usuario"
        active={showAccess}
        handleToggle={toggleAccess}
      >
        <div className=" p-8  h-[500px] w-[400px] md:h-[570px] md:w-[500px] lg:w-[1000px] overflow-y-auto">
          <Paginate
            data={replacedAccesEnabled}
            showItems={5}
            options={{
              labelSelector: "Mostrar",
              optionRange: [20, 50, 100],
              searchBy: ["menu", "reporte", "nombreReporte"],
            }}
          >
            <UserAccessTable handleAssignAccess={handleAssignAccess} />
          </Paginate>
        </div>
      </FormModal>
      <ConfirmModal ref={confirmModalRef} />
    </>
  );
}

