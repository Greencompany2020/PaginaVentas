import { useState, useRef } from "react";
import UserTable from "./UserTable";
import Paginate from "../../paginate";
import UserInfo from "./UserInfo";
import UserForm from "./UserForm";
import UserAccessTable from "./UserAccessTable";
import { FormModal } from "../../modals";
import useToggle from "../../../hooks/useToggle";
import { ConfirmModal } from "../../modals";
import generateKey from "../../paginate/generateKey";

export default function Users(props) {
  const {
    data,
    getUserDetail,
    createUser,
    updateUser,
    deleteUser,
    assignAccess,
    groups,
    access,
  } = props;

  const confirmModalRef = useRef(null);
  const [focusedItem, setFocused] = useState({});
  const [itemDetail, setItemDetail] = useState({});
  const [replacedAccesEnabled, setReplacedAccessEnabled] = useState([]);
  const [visible, toggleVisible] = useToggle();
  const [showAccess, toggleAccess] = useToggle();

  const [modalContent, setmodalContent] = useState({
    target: "",
    item: {},
    title: "",
  });

  const ModalContent = () => {
    const { target, item } = modalContent;

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
          item={itemDetail}
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
      setFocused(userDetail);
      setItemDetail(focused);
      setReplacedAccessEnabled(userAccess);
    }
  };

  const getUpdateAccess = async () => {
    const { Id } = focusedItem;
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
    const idUser = focusedItem.Id;
    const replacedEnabled = enabled == true ? "N" : "Y";
    const body = {
      idDashboard,
      idUser,
      enabled: replacedEnabled,
    };
    await assignAccess(body);
    await getUpdateAccess();
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <UserInfo item={focusedItem} />
        <div className="mt-4 mb-4 md:mb-4 flex justify-start">
          <button
            className="primary-btn w-20"
            onClick={() => handleModalContent("addUser", "Agregar usuario")}
          >
            Agregar
          </button>
        </div>
        <section>
          <Paginate
            data={data}
            showItems={5}
            options={{
              labelSelector: "Mostrar",
              optionRange: [20, 50, 100],
              searchBy: ["Nombre", "UserCode", "NoEmpleado"],
            }}
            actionsToChild={{
              handleOnSelect,
              handleModalContent,
              handleDeleteUser,
              toggleAccess,
            }}
          >
            <UserTable />
          </Paginate>
        </section>
      </div>

      <FormModal
        key={generateKey(1)}
        name={modalContent.title}
        active={visible}
        handleToggle={toggleVisible}
      >
        <ModalContent />
      </FormModal>

      <FormModal
        key={generateKey(2)}
        name="Accesos de usuario"
        active={showAccess}
        handleToggle={toggleAccess}
      >
        <div className=" p-8  h-[400px] w-[400px] md:h-[400px] md:w-[500px] lg:w-[1000px] overflow-y-auto">
          <UserAccessTable
            items={replacedAccesEnabled}
            handleAssignAccess={handleAssignAccess}
          />
        </div>
      </FormModal>
      <ConfirmModal ref={confirmModalRef} />
    </>
  );
}

