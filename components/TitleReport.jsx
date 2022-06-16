import Image from "next/image";
import Trend from "../public/images/trend.png";

export default function TitleReport(props) {
  const { title, description } = props;
  return (
    <section className=" pl-8 pt-4 bg-slate-50">
      <div className="flex flex-row items-center space-x-3">
        <div>
          <Image
            src={Trend}
            alt=""
            className="w-8 h-8 text-black"
            height={32}
            width={32}
          />
        </div>
        <h1 className=" font-semibold uppercase md:text-xl ">{title}</h1>
      </div>
    </section>
  );
}

