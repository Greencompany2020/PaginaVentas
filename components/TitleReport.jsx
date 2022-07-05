import Image from "next/image";
import Trend from "../public/images/trend.png";

export default function TitleReport(props) {
  const { title, description } = props;
  return (
    <section className=" pl-14 md:pl-8 pt-4 bg-slate-100">
      <div className="flex flex-row items-center space-x-3">
        <figure>
          <Image
            src={Trend}
            alt=""
            className="w-8 h-8 text-black"
            height={24}
            width={24}
          />
        </figure>
        <h1 className=" font-semibold uppercase text-sm md:text-lg truncate">{title}</h1>
      </div>
    </section>
  );
}

