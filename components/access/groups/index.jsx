import React, { useRef, useState } from "react";
import Paginate from "../../paginate";
import GroupTable from "./GroupTable";
import { FormModal } from "../../modals";
import GroupForm from "./GroupForm";
import useToggle from "../../../hooks/useToggle";
import { ConfirmModal } from "../../modals";

export default function Groups(props) {
  const confirmModalRef = useRef(null);
  const { data, createGroup, updateGroup, deleteGroup } = props;
  const [visible, toggleVisible] = useToggle();
  const [modalContent, setmodalContent] = useState({
    target: "",
    item: {},
    title: "",
  });

  const ModalContent = () => {
    const { target, item } = modalContent;
    if (target == "createGroup") {
      return (
        <GroupForm
          toggleVisible={toggleVisible}
          handleSubmit={handleCreateGroup}
        />
      );
    }

    if (target == "updateGroup") {
      return (
        <GroupForm
          item={item}
          toggleVisible={toggleVisible}
          handleSubmit={handleUpdateGroup}
        />
      );
    }
    return <></>;
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

  const handleDeleteGroup = async (id) => {
    const confirm = await confirmModalRef.current.show();
    if (confirm) deleteGroup(id);
  };

  const handleUpdateGroup = async (id, body) => {
    await updateGroup(id, body);
    toggleVisible();
  };

  const handleCreateGroup = async (body) => {
    await createGroup(body);
    toggleVisible();
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="mt-4 mb-4 md:mb-4 flex justify-start">
          <button
            className="primary-btn w-20"
            onClick={() => handleModalContent("createGroup", "Crear grupo")}
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
          >
            <GroupTable
              handleModalContent={handleModalContent}
              handleDeleteGroup={handleDeleteGroup}
            />
          </Paginate>
        </section>
      </div>
      <FormModal
        name={modalContent.title}
        active={visible}
        handleToggle={toggleVisible}
      >
        <ModalContent />
      </FormModal>
      <ConfirmModal ref={confirmModalRef} />
    </>
  );
}

