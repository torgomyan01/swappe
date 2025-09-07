import { useEffect, useState } from "react";
import clsx from "clsx";
import { addToast } from "@heroui/react";

const ArrImagesEmpty = Array.from({ length: 9 });

function DynamicTag({ tag: Tag = "div", children, ...props }: any) {
  return <Tag {...props}>{children}</Tag>;
}

function UploadPhotos() {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (files.length > 9) {
      addToast({
        title: "Предупреждение",
        description: "Вы можете выбрать до 9 изображений.",
        color: "secondary",
      });
      const cropImages = files.filter((file, index) => index < 9);
      setFiles(cropImages);
    }
  }, [files]);

  function SelectImages(e: any) {
    setFiles((old) => [...old, ...e.target.files]);
  }

  function RemoveImage(index: number) {
    const NewFiles = files.filter((_, _index) => _index !== index);

    setFiles(NewFiles);
  }

  return (
    <>
      <div className="title-nums">
        <span className="text">Фото</span>
        <span className="num">{files.length}/9</span>
      </div>

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
            Чтобы сделать фото обложкой карточки, перетащи его на первое место.
            Остальные фото расставь в том порядке, который хочешь видеть на
            сайте
          </span>
        </div>
        <div className="close">
          <img
            src="/img/close-pop.svg"
            alt="close"
            className="min-w-[20px] cursor-pointer opacity-65 hover:opacity-100"
          />
        </div>
      </div>
      <div className="media-items grid grid-cols-6 gap-3">
        {ArrImagesEmpty.map((item: any, index: number) => (
          <DynamicTag
            tag={index === files.length ? "label" : "div"}
            key={`items-labels-${index}`}
            className={clsx(
              "item overflow-hidden h-[140px] col-span-1 row-span-1 relative group ",
              {
                active: index === files.length,
                "col-span-2 row-span-2 !h-auto": index === 0,
                "cursor-pointer": index === files.length,
              },
            )}
          >
            {index === 0 && <span className="style">Обложка</span>}

            {index < files.length && (
              <>
                <img
                  src={URL.createObjectURL(files[index])}
                  alt=""
                  className="w-full h-full object-cover pointer-events-none !max-h-[295px]"
                />

                <button
                  type="button"
                  className="w-7 h-7 bg-white/70 flex-jc-c absolute top-2 right-2 absolute rounded-full opacity-0 cursor-pointer group-hover:opacity-100"
                  onClick={() => RemoveImage(index)}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </>
            )}

            {index > 0 && index < files.length && (
              <span className="style">{index + 1}</span>
            )}

            {index === files.length && (
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
