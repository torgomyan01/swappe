import clsx from "clsx";
import { CreateObjectCols, CreateObjectGrid } from "@/utils/helpers";
import { fileHost } from "@/utils/consts";
import Image from "next/image";
import { PhotoView } from "react-photo-view";
import { memo, useMemo } from "react";

interface IThisProps {
  message: IMessage;
  isMin?: boolean;
}

const MessageImagesBlock = memo(function MessageImagesBlock({
  message,
  isMin = false,
}: IThisProps) {
  // Memoize file paths to prevent unnecessary re-renders
  const filePaths = useMemo(() => {
    return message.file_paths || [];
  }, [message.file_paths]);

  // Memoize grid classes to prevent unnecessary recalculations
  const gridClasses = useMemo(() => {
    return CreateObjectGrid(filePaths);
  }, [filePaths]);

  return (
    <div
      className={clsx(
        "w-full grid gap-2 mb-4 items-stretch",
        {
          "!mb-2 !flex-js-s gap-4": isMin,
        },
        gridClasses,
      )}
    >
      {filePaths.map((url: string, i: number) => (
        <PhotoView key={`photo-${i}-${url}`} src={`${fileHost}${url}`}>
          <Image
            key={`image-${i}-${url}`}
            src={`${fileHost}${url}`}
            alt="image"
            width={200}
            height={200}
            className={clsx(
              "rounded-[8px] object-cover cursor-pointer w-full",
              {
                "!w-[50px] !h-[50px]": isMin,
              },
              CreateObjectCols(i, filePaths),
            )}
          />
        </PhotoView>
      ))}
    </div>
  );
});

export default MessageImagesBlock;
