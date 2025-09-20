import clsx from "clsx";
import { CreateObjectCols, CreateObjectGrid, RandomKey } from "@/utils/helpers";

function MessageImagesBlock() {
  const images = Array.from({ length: 8 });

  return (
    <div className={clsx("w-full grid gap-2 mb-4", CreateObjectGrid(images))}>
      {images.map((_, i) => (
        <img
          key={RandomKey()}
          src="/img/chat/sms-img.png"
          alt="image"
          className={clsx("rounded-[8px]", CreateObjectCols(i, images))}
        />
      ))}
    </div>
  );
}

export default MessageImagesBlock;
