import { sliceText } from "@/utils/helpers";
import Link from "next/link";
import { fileHost } from "@/utils/consts";
import { memo, useMemo } from "react";

interface IThisProps {
  message: IMessage;
}

const MyMessageFileBlock = memo(function MyMessageFileBlock({
  message,
}: IThisProps) {
  // Memoize file paths to prevent unnecessary re-renders
  const filePaths = useMemo(() => {
    return message.file_paths || [];
  }, [message.file_paths]);

  return (
    <div className="flex-js-c gap-3">
      {filePaths.map(
        (filePath: { name: string; url: string }, index: number) => (
          <div
            key={`file-${index}-${filePath.name}`}
            className="w-full p-2 bg-black/20 rounded-[8px] mb-2 flex-js-c gap-2 flex-wrap"
          >
            <Link
              href={`${fileHost}${filePath.url}`}
              target="_blank"
              className="min-w-10 h-10 !flex-jc-c bg-black/20 rounded-[8px] cursor-pointer"
            >
              <i className="fa-regular fa-arrow-down-to-line"></i>
            </Link>
            <b className="mr-4">{sliceText(filePath.name, 50)}</b>
          </div>
        ),
      )}
    </div>
  );
});

export default MyMessageFileBlock;
