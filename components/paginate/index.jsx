import React, { useReducer, useEffect, cloneElement, Children } from "react";
import PropTypes from "prop-types";
import ShowSelector from "./ShowSelector";
import Pagination from "./Pagination";
import Search from "./Search";
import styles from "./style.module.css";

const NEXT_PAGE = "NEXT_PAGE";
const PREV_PAGE = "PREV_PAGE";
const SELECT_PAGE = "SELECT_PAGE";
const FIRST_PAGE = "FIRST_PAGE";
const LAST_PAGE = "LAST_PAGE";
const CALCULATE_PAGES = "CALCULATE_PAGES";
const CALCULATE_SLICE = "CALCULATE_SLICE";
const CHANGE_SHOW_ITEMS = "CHANGE_SHOW_ITEMS";
const REPLACE_SLICE = "REPLACE_SLICE";

export default function Paginate(props) {
  const initialState = {
    dataFilter: [],
    currentPage: props.currentPage,
    pages: props.pages,
    showItems: props.options.optionRange[0],
    search: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case NEXT_PAGE:
        return {
          ...state,
          dataFilter: [...action.payload.newSlice],
          currentPage: action.payload.newCurrent,
        };
      case PREV_PAGE:
        return {
          ...state,
          dataFilter: [...action.payload.newSlice],
          currentPage: action.payload.newCurrent,
        };
      case SELECT_PAGE:
        return {
          ...state,
          dataFilter: [...action.payload.newSlice],
          currentPage: action.payload.newCurrent,
        };
      case FIRST_PAGE:
        return {
          ...state,
          dataFilter: [...action.payload.newSlice],
          currentPage: action.payload.newCurrent,
        };
      case LAST_PAGE:
        return {
          ...state,
          dataFilter: [...action.payload.newSlice],
          currentPage: action.payload.newCurrent,
        };
      case CALCULATE_PAGES:
        return { ...state, pages: action.payload };
      case CALCULATE_SLICE:
        return { ...state, dataFilter: [...action.payload] };
      case CHANGE_SHOW_ITEMS:
        return { ...state, showItems: action.payload };
      case REPLACE_SLICE:
        return { ...state, dataFilter: [...action.payload] };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const { showItems, currentPage } = state;
    const { data } = props;
    const definedPages = calculatePages(data, showItems);
    const definedSlice = calculateSlice(data, showItems, currentPage);
    dispatch({ type: CALCULATE_PAGES, payload: definedPages });
    dispatch({ type: CALCULATE_SLICE, payload: definedSlice });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const renderChildren = Children.map(props.children, (child) => {
    return cloneElement(child, {
      items: [...state.dataFilter],
    });
  });

  const nextPage = () => {
    const { currentPage, pages, showItems } = state;
    const { data } = props;
    const newCurrent = currentPage + 1;
    if (newCurrent <= pages) {
      const newSlice = calculateSlice(data, showItems, newCurrent);
      dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
    }
  };

  const prevPage = () => {
    const { currentPage, showItems } = state;
    const { data } = props;
    const newCurrent = currentPage - 1;
    if (newCurrent > 0) {
      const newSlice = calculateSlice(data, showItems, newCurrent);
      dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
    }
  };

  const selectPage = (page) => {
    const { showItems, pages } = state;
    const { data } = props;
    if (page > 0 && page <= pages) {
      const newSlice = calculateSlice(data, showItems, page);
      const newCurrent = page;
      dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
    }
  };

  const firstPage = () => {
    const { showItems } = state;
    const { data } = props;
    const newSlice = calculateSlice(data, showItems, 1);
    const newCurrent = 1;
    dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
  };

  const lastPage = () => {
    const { showItems, pages } = state;
    const { data } = props;
    const newSlice = calculateSlice(data, showItems, pages);
    const newCurrent = pages;
    dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
  };

  const handleChangeShowItem = (newRange) => {
    const { currentPage } = state;
    const parsedRange = parseInt(newRange);
    const { data } = props;
    const definedPages = calculatePages(data, parsedRange);
    const definedSlice = calculateSlice(data, parsedRange, currentPage);
    dispatch({ type: CALCULATE_PAGES, payload: definedPages });
    dispatch({ type: CALCULATE_SLICE, payload: definedSlice });
    dispatch({ type: CHANGE_SHOW_ITEMS, payload: parsedRange });
    if (definedPages < currentPage) {
      const newSlice = calculateSlice(data, parsedRange, 1);
      const newCurrent = 1;
      dispatch({ type: NEXT_PAGE, payload: { newSlice, newCurrent } });
    }
  };

  const search = (param) => {
    const { searchBy } = props.options;
    const { data } = props;
    const { showItems, currentPage } = state;
    if (!isEmptyString(param)) {
      const filtered = [];
      data.forEach((item) => {
        searchBy.forEach((key) => {
          if (String(item[key]).includes(param)) {
            const isOnResult = filtered.find(
              (filterItem) => item == filterItem
            );
            if (!isOnResult) filtered.push(item);
          }
        });
      });
      if (Object.keys(filtered).length > 0) {
        dispatch({ type: REPLACE_SLICE, payload: filtered });
      }
    } else {
      const definedSlice = calculateSlice(data, showItems, currentPage);
      dispatch({ type: CALCULATE_SLICE, payload: definedSlice });
    }
  };

  /**
   * calcula el array resultante de para mostrar
   * @param {array} data
   * @param {number} showItems
   * @param {number} current
   * @returns
   */
  const calculateSlice = (data, show, current) => {
    if (!Array.isArray(data)) return [];
    if (data.length < 0 || show < 0 || current < 0) return [];
    const limit = current * show;
    const offset = current == 1 ? 0 : limit - show;
    const slice = data.slice(offset, limit);
    return slice;
  };

  /**
   * calcula el numero de paginas segun el numero que se desea visualizar
   * @param {array} data
   * @param {number} show
   * @returns
   */
  const calculatePages = (data, show) => {
    if (!Array.isArray(data)) return 0;
    if (data.length < 0 || show < 0) return 0;
    const pages = Math.ceil(data.length / show);
    return pages;
  };

  /**
   * remplazo los datos filtrados
   * @param {array} data
   * @param {number} show
   * @returns
   */
  const replaceSlice = (data, show) => {
    if (!Array.isArray(data) || show.length < 0) return [];
    const offset = 1;
    const slice = data.slice(offset, show);
    return slice;
  };

  /**
   * Retira los espacios entre palabras y revisa si esta vacio
   * @param {string} string
   * @returns
   */
  const isEmptyString = (string) => {
    const replaced = string.replace(/\s+/g, "");
    if (replaced.length !== 0) return false;
    return true;
  };

  return (
    <>
      <div className={styles.HeadContainer}>
        <ShowSelector
          labelSelector={props.options.labelSelector}
          optionRange={props.options.optionRange}
          handleChangeRange={handleChangeShowItem}
        />
        <Search handleSearch={search} />
      </div>
      {renderChildren}
      <Pagination
        pages={state.pages}
        handleNext={nextPage}
        handleBack={prevPage}
        handleSelect={selectPage}
        handleFirst={firstPage}
        handleLast={lastPage}
        current={state.currentPage}
      />
    </>
  );
}

//Props por defecto del componente
Paginate.defaultProps = {
  currentPage: 1,
  pages: 1,
  showItems: 10,
  currentPage: 1,
  options: {
    labelSelector: "Mostrar",
    optionRange: [10, 50, 100],
  },
};

//Props obligatiores del componente
Paginate.propTypes = {
  data: PropTypes.array,
  showItems: PropTypes.number,
  options: PropTypes.exact({
    labelSelector: PropTypes.string,
    optionRange: PropTypes.arrayOf(PropTypes.number),
    searchBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
};

