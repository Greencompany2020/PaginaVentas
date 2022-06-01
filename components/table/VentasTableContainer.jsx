const VentasTableContainer = ({ children }) => {
  return (
    <section className="h-full overflow-hidden">
      <div className="h-[70%]  overflow-y-auto rounded-xl">{children}</div>
    </section>
  );
};

export default VentasTableContainer;
