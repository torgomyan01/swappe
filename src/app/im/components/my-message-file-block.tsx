import { RandomKey, sliceText } from "@/utils/helpers";
import Link from "next/link";
import { fileHost } from "@/utils/consts";

interface IThisProps {
  message: IMessage;
}

function MyMessageFileBlock({ message }: IThisProps) {
  return (
    <div className="flex-js-c gap-3">
      {message.file_paths?.map((filePath: { name: string; url: string }) => (
        <div
          key={RandomKey()}
          className="w-full p-2 bg-black/20 rounded-[8px] mb-2 flex-js-c gap-2"
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
      ))}
    </div>
  );
}

export default MyMessageFileBlock;
