import { getRuTubeThumbnail, getYouTubeThumbnailUrl } from "@/utils/helpers";

interface IThisProps {
  url: string;
  index: number;
  onDelete: () => void;
}

function UploadVideoImage({ url, index, onDelete }: IThisProps) {
  function PrintImageSrc(url: string) {
    if (/youtube|youtu\.be/.test(url)) {
      return getYouTubeThumbnailUrl(url);
    }

    if (/rutube/.test(url)) {
      return getRuTubeThumbnail(url);
    }
  }

  return (
    <div className="image rounded-[12px] overflow-hidden">
      <span className="number">{index}</span>
      <span className="close-white" onClick={onDelete}>
        <img src="/img/creating-proposal/close-white.svg" alt="" />
      </span>
      <img src={PrintImageSrc(url)} alt="" className="img" />
    </div>
  );
}

export default UploadVideoImage;
