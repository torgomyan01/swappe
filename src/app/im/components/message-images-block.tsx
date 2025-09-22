import clsx from "clsx";
import { CreateObjectCols, CreateObjectGrid, RandomKey } from "@/utils/helpers";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import { PhotoView } from "react-photo-view";

interface IThisProps {
  message: IMessage;
}

function MessageImagesBlock({ message }: IThisProps) {
  return (
    <div
      className={clsx(
        "w-full grid gap-2 mb-4 items-stretch",
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
              "rounded-[8px] object-cover cursor-pointer",
              CreateObjectCols(i, message.file_paths || []),
            )}
          />
        </PhotoView>
      ))}
    </div>
  );
}

export default MessageImagesBlock;
