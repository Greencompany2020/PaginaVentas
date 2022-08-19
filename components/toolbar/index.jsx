import styles from "./style.module.css";
import PropTypes from "prop-types";
export default function Toolbar(props) {
  const { bodyItems, footerItems, children } = props;
  return (
    <aside className={styles.Toolbar}>
      <section className={styles.Header}>{children}</section>
      <section className={styles.Body}>
        {(() => {
          if (bodyItems && Array.isArray(bodyItems)) {
            const ItemList = bodyItems.map((Item, index) => (
              <Item key={index} />
            ));
            return ItemList;
          }
        })()}
      </section>
      <footer className={styles.Footer}>
        {(() => {
          if (footerItems && Array.isArray(footerItems)) {
            const ItemList = footerItems.map((Item, index) => (
              <Item key={index} />
            ));
            return ItemList;
          }
        })()}
      </footer>
    </aside>
  );
}

//Props del componente
Toolbar.propTypes = {
  bodyItems: PropTypes.arrayOf(PropTypes.func),
  footerItems: PropTypes.arrayOf(PropTypes.func),
};

