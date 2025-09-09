import { getRuTubeThumbnail, getYouTubeThumbnailUrl } from "@/utils/helpers";

interface IThisProps {
  url: string;
}

function SelectedVideoImage({ url }: IThisProps) {
  function PrintImageSrc(url: string) {
    if (/youtube|youtu\.be/.test(url)) {
      return getYouTubeThumbnailUrl(url);
    }

    if (/rutube/.test(url)) {
      return getRuTubeThumbnail(url);
    }
  }

  return (
    <div className="w-full h-[180px] rounded-[12px] overflow-hidden">
      <img
        src={PrintImageSrc(url)}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default SelectedVideoImage;
