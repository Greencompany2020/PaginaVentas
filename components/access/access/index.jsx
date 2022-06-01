import React, { useState, useRef } from "react";
import Paginate from "../../paginate";
import TableAccess from "./TableAccess";
import AccessForm from "./AccessForm";
import useToggle from "../../../hooks/useToggle";
import { ConfirmModal } from "../../modals";
import { FormModal } from "../../modals";

export default function Access(props) {
  const confirmModalRef = useRef(null);
  const { data, createAccess, updateAccess, deleteAccess } = props;
  const [visible, toggleVisible] = useToggle();
  const [modalContent, setmodalContent] = useState({
    target: "",
    item: {},
    title: "",
  });

  const ModalContent = () => {
    const { target, item } = modalContent;
    if (target == "createAccess") {
      return (
        <AccessForm toggleVisible={toggleVisible} handleSubmit={createAccess} />
      );
    }

    if (target == "updateAccess") {
      return (
        <AccessForm
          item={item}
          toggleVisible={toggleVisible}
          handleSubmit={updateAccess}
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

  const handleDeleteAccess = async (id) => {
    const confirm = await confirmModalRef.current.show();
    if (confirm) deleteAccess(id);
  };

  return (
    <>
      <div className="p-4 md:p-8">
        <div className="mt-4 mb-4 md:mb-4 flex justify-start">
          <button
            className="primary-btn w-20"
            onClick={() => handleModalContent("createAccess", "Crear Acceso")}
          >
            Agregar
          </button>
        </div>

        <section>
          <Paginate
            data={[...data]}
            showItems={5}
            options={{
              labelSelector: "Mostrar",
              optionRange: [20, 50, 100],
              searchBy: ["menu", "reporte", "nombreReporte"],
            }}
            actionsToChild={{
              handleModalContent,
              handleDeleteAccess,
            }}
          >
            <TableAccess />
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

