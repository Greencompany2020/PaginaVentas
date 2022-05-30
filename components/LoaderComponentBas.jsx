export default function LoaderComponentBas({ isLoading }) {
  return (
    <div className={`grid place-items-center ${!isLoading && "hidden"}`}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
