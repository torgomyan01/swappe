import { Skeleton } from "@heroui/react";

function OfferCardLoading() {
  return (
    <div className="offer-item">
      <Skeleton className="w-full h-[320px] rounded-[15px]" />
      <div className="text-wrap">
        <Skeleton className="w-[70%] h-[14px] rounded-[8px]" />
        <Skeleton className="w-[30px] h-[14px] rounded-[8px]" />
      </div>
      <Skeleton className="w-full h-[14px] rounded-[8px] mt-1" />
      <span className="barter">
        <Skeleton className="w-[100px] h-[10px] rounded-[5px] mt-3" />
      </span>
      <Skeleton className="w-[150px] h-[18px] rounded-[8px] mt-1" />
    </div>
  );
}

export default OfferCardLoading;
