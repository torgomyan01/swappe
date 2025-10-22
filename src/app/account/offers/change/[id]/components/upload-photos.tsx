import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import clsx from "clsx";
import { addToast } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { setCompanyImages, selectOfferImages } from "@/redux/offer-page";
import { fileHost, fileHostRemove } from "@/utils/consts";
import axios from "axios";

const ArrImagesEmpty = Array.from({ length: 9 });

function DynamicTag({ tag: Tag = "div", children, ...props }: any) {
  return <Tag {...props}>{children}</Tag>;
}

interface ImageItem {
  type: "file" | "url";
  data: File | string;
  id: string;
}

function UploadPhotos() {
  const dispatch = useDispatch();
  const offerImages = useSelector(selectOfferImages);

  const [images, setImages] = useState<ImageItem[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const initializedRef = useRef<boolean>(false);

  // Initialize with existing images - memoized to prevent unnecessary re-renders
  const existingImages = useMemo(() => {
    if (offerImages && offerImages.length > 0) {
      return offerImages.map((img: string, index: number) => ({
        type: "url" as const,
        data: img, // Keep as relative path, don't add fileHost
        id: `existing-${index}`,
      }));
    }
    return [];
  }, [offerImages]);

  useEffect(() => {
    if (!initializedRef.current && existingImages.length) {
      setImages(existingImages);
      initializedRef.current = true;
    }
  }, [existingImages]);

  // Memoized helper to sync local images to Redux store
  const syncRedux = useCallback(
    (nextImages: ImageItem[]) => {
      const files = nextImages
        .filter((img) => img.type === "file")
        .map((img) => img.data as File);
      const urls = nextImages
        .filter((img) => img.type === "url")
        .map((img) => img.data as string);
      dispatch(setCompanyImages([...files, ...urls]));
    },
    [dispatch],
  );

  useEffect(() => {
    if (images.length > 9) {
      addToast({
        title: "Предупреждение",
        description: "Вы можете выбрать до 9 изображений.",
        color: "secondary",
      });
      const cropImages = images.filter((_, index) => index < 9);
      setImages(cropImages);
      syncRedux(cropImages);
    }
  }, [images, syncRedux]);
  // Removed blanket sync effect to avoid feedback loop; we sync explicitly in handlers

  const SelectImages = useCallback(
    (e: any) => {
      const newFiles = Array.from(e.target.files).map(
        (file: File, index: number) => ({
          type: "file" as const,
          data: file,
          id: `new-${Date.now()}-${index}`,
        }),
      );

      const updatedImages = [...images, ...newFiles];
      setImages(updatedImages);
      syncRedux(updatedImages);
    },
    [images, syncRedux],
  );

  const RemoveImage = useCallback(
    async (index: number) => {
      const imageToRemove = images[index];

      // If it's an existing URL image, try to remove it from the server
      if (imageToRemove.type === "url") {
        try {
          await axios.post(fileHostRemove, {
            image_url: imageToRemove.data,
          });
        } catch (error) {
          console.warn("Failed to remove image from server:", error);
          // Continue with local removal even if server removal fails
        }
      }

      const newImages = images.filter((_, _index) => _index !== index);
      setImages(newImages);
      syncRedux(newImages);
    },
    [images, syncRedux],
  );

  const onDragStart = useCallback(
    (index: number) => {
      if (index < images.length) {
        dragIndexRef.current = index;
      }
    },
    [images.length],
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((index: number) => {
    const from = dragIndexRef.current;
    if (from === null || from === index) {
      dragIndexRef.current = null;
      return;
    }
    setImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      dragIndexRef.current = null;
      syncRedux(next);
      return next;
    });
  }, []);

  const [infoBlock, setInfoBlock] = useState<boolean>(true);

  return (
    <>
      <div className="title-nums">
        <span className="text">Фото</span>
        <span className="num">{images.length}/9</span>
      </div>
      {infoBlock && (
        <div className="info-block">
          <div className="icon">
            <img
              src="/img/creating-proposal/err-green.svg"
              alt=""
              className="min-w-[20px] relative top-1"
            />
          </div>
          <div className="texts">
            <b>Управляй порядком</b>
            <span>
              Чтобы сделать фото обложкой карточки, перетащи его на первое
              место. Остальные фото расставь в том порядке, который хочешь
              видеть на сайте
            </span>
          </div>
          <div className="close" onClick={() => setInfoBlock(false)}>
            <img
              src="/img/close-pop.svg"
              alt="close"
              className="min-w-[20px] cursor-pointer opacity-65 hover:opacity-100"
            />
          </div>
        </div>
      )}

      <div className="media-items grid grid-cols-6 gap-3">
        {ArrImagesEmpty.map((item: any, index: number) => (
          <DynamicTag
            tag={index === images.length ? "label" : "div"}
            key={`items-labels-${index}`}
            className={clsx(
              "item overflow-hidden h-[140px] col-span-1 row-span-1 relative group ",
              {
                active: index === images.length,
                "col-span-2 row-span-2 !h-auto": index === 0,
                "cursor-pointer": index === images.length,
              },
            )}
            draggable={index < images.length}
            onDragStart={() => onDragStart(index)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(index)}
          >
            {index === 0 && <span className="style">Обложка</span>}

            {index < images.length && (
              <>
                <img
                  src={
                    images[index].type === "file"
                      ? URL.createObjectURL(images[index].data as File)
                      : (images[index].data as string).startsWith("/")
                        ? `${fileHost}${images[index].data}`
                        : (images[index].data as string)
                  }
                  alt=""
                  className="w-full h-full object-cover pointer-events-none !max-h-[295px]"
                />

                <button
                  type="button"
                  className="w-7 h-7 bg-white/70 flex-jc-c absolute top-2 right-2 rounded-full opacity-0 cursor-pointer group-hover:opacity-100"
                  onClick={() => RemoveImage(index)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </>
            )}

            {index > 0 && index < images.length && (
              <span className="style">{index + 1}</span>
            )}

            {index === images.length && (
              <>
                <img
                  src="/img/creating-proposal/plus-green2.svg"
                  alt=""
                  className="icon"
                />

                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={SelectImages}
                />
              </>
            )}
          </DynamicTag>
        ))}
      </div>
    </>
  );
}

export default UploadPhotos;
