import clsx from "clsx";

interface IThisProps {
  title: string;
  size?: "sm" | "md" | "lg";
}

function EmptyRes({ title, size = "lg" }: IThisProps) {
  return (
    <div className="w-full flex-jc-c flex-col">
      <img
        src="/img/icon-empty-res.svg"
        alt="icon-empty-res"
        className={clsx("mr-4", {
          "!w-[100px] !h-[100px]": size === "sm",
          "!w-[140px] !h-[140px]": size === "md",
          "!w-[180px] !h-[180px]": size === "lg",
        })}
      />
      <h3
        className={clsx("text-center font-bold", {
          "!text-[16px]": size === "sm",
          "!text-[22px]": size === "md",
          "!text-[26px]": size === "lg",
        })}
      >
        {title}
      </h3>
    </div>
  );
}

export default EmptyRes;
