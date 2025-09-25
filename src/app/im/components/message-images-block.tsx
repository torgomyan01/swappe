import clsx from "clsx";
import { CreateObjectCols, CreateObjectGrid, RandomKey } from "@/utils/helpers";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import { PhotoView } from "react-photo-view";

interface IThisProps {
  message: IMessage;
  isMin?: boolean;
}

function MessageImagesBlock({ message, isMin = false }: IThisProps) {
  return (
    <div
      className={clsx(
        "w-full grid gap-2 mb-4 items-stretch",
        {
          "!mb-2 !flex-js-s gap-4": isMin,
        },
        CreateObjectGrid(message.file_paths || []),
      )}
    >
      {message.file_paths?.map((url: string, i: number) => (
        <PhotoView key={RandomKey()} src={`${fileHost}${url}`}>
          <Image
            key={RandomKey()}
            src={`${fileHost}${url}`}
            alt="image"
            width={200}
            height={200}
            className={clsx(
              "rounded-[8px] object-cover cursor-pointer w-full",
              {
                "!w-[50px] !h-[50px]": isMin,
              },
              CreateObjectCols(i, message.file_paths || []),
            )}
          />
        </PhotoView>
      ))}
    </div>
  );
}

export default MessageImagesBlock;
