interface IThisProps {
  title: string;
}

function EmptyRes({ title }: IThisProps) {
  return (
    <div className="w-full flex-jc-c flex-col">
      <img
        src="/img/icon-empty-res.svg"
        alt="icon-empty-res"
        className="mr-4"
      />
      <h3 className="text-center font-bold !text-[22px]">{title}</h3>
    </div>
  );
}

export default EmptyRes;
