import React from "react";
import styles from "./style.module.css";
import PropTypes from "prop-types";
import generateKey from "./generateKey";

export default function Pagination(props) {
  const {
    pages,
    handleNext,
    handleBack,
    handleSelect,
    handleFirst,
    handleLast,
    current,
  } = props;
  return (
    <div className={styles.Pagination}>
      <button
        className={styles.PaginationButtom}
        onClick={handleFirst}
        key={generateKey(45345454)}
      >
        Primero
      </button>
      <button
        className={styles.PaginationButtom}
        onClick={handleBack}
        key={generateKey(54534234)}
      >
        Atras
      </button>
      {(() => {
        let items = [];
        for (let index = 1; index <= pages; index++) {
          items.push(
            <button
              key={generateKey(index + 132323442)}
              onClick={() => handleSelect(index)}
              className={`${styles.PaginationButtomStep} ${
                current == index && styles.PaginationActive
              }`}
            >
              {index}
            </button>
          );
        }
        return items;
      })()}
      <button
        className={styles.PaginationButtom}
        onClick={handleNext}
        key={generateKey(2424234)}
      >
        Siguiente
      </button>
      <button
        className={styles.PaginationButtom}
        onClick={handleLast}
        key={generateKey(4342343)}
      >
        Ultimo
      </button>
    </div>
  );
}

function Buttons({ pages, handleSelect }) {
  if (pages == 0) return <></>;
  const items = [];
  for (let index = 0; pages > index; index + 1) {
    items.push(
      <button
        key={index + 1}
        onClick={() => handleSelect(i + 1)}
        className={styles.PaginationPage}
      >
        {index}
      </button>
    );
  }

  return items;
}

//Props obligatiores del componente
Pagination.propTypes = {
  pages: PropTypes.number.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  handleFirst: PropTypes.func.isRequired,
  handleLast: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired,
};

