import Image from "next/image";
import { fileHost, SITE_URL } from "@/utils/consts";
import Link from "next/link";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { Tooltip } from "@heroui/react";
import { sliceText } from "@/utils/helpers";

interface IThisProps {
  item: IChatItems;
}

function ChatItem({ item }: IThisProps) {
  const { id } = useParams();
  return (
    <Link
      href={`${SITE_URL.CHAT}/${item.id}`}
      className={clsx("dialogues-item", {
        active: id && +id === item.id,
      })}
    >
      <div className="images">
        <div className="big-img">
          <Image
            src={`${fileHost}${item.deal.owner_offer.images[0]}`}
            alt="img"
            width={200}
            height={200}
            className="rounded-[8px]"
          />
        </div>
        <div className="small-img border-[3px] border-[#f8f2ea]">
          <Tooltip content={`Company: ${item.deal.client.company.name}`}>
            <Image
              src={`${fileHost}${item.deal.client.company.image_path}`}
              alt={item.deal.client.company.name}
              width={200}
              height={200}
            />
          </Tooltip>
        </div>
      </div>
      <div className="texts">
        <b title={item.chat_name}>{sliceText(item.chat_name)}</b>
        <span>Swappe</span>
      </div>
    </Link>
  );
}

export default ChatItem;
