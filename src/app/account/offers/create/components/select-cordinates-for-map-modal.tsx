import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { useState, useCallback, memo } from "react";
import SelectCardYandexMap from "@/components/common/select-card-yandex-map/select-card-yandex-map";
import { useDispatch } from "react-redux";
import { setCompanyCoordinates } from "@/redux/offer-page";

function SelectCordinatesForMapModal() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<boolean>(false);
  const [selectedCords, setSelectedCords] = useState<[number, number] | null>(
    null,
  );

  // Use useCallback to memoize the function and prevent re-renders
  const selectCordinatesForMap = useCallback((cords: [number, number]) => {
    setSelectedCords(cords);
  }, []);

  const getMapIframeUrl = (coords: [number, number]) => {
    const [lat, lon] = coords;
    return `https://yandex.ru/map-widget/v1/?ll=${lon},${lat}&z=16&pt=${lon},${lat},pm2rdl&whatshere[zoom]=16&z=16&l=map&controls=false`;
  };

  return (
    <>
      <span className="creating-title">Регион покрытия</span>

      {selectedCords ? (
        <div className="area overflow-hidden relative  !border-none">
          <iframe
            src={getMapIframeUrl(selectedCords)}
            width="100%"
            height="100%"
            style={{
              border: "none",
              pointerEvents: "none",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Yandex Map"
          />
          <div className="absolute top-0 left-0 w-full h-full cursor-default bg-black/20 flex-jc-c group">
            <button
              className="w-10 h-10 bg-white rounded-full cursor-pointer opacity-0 transition group-hover:opacity-100"
              onClick={() => setSelectedCords(null)}
            >
              <i className="fa-solid fa-xmark opacity-65"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="area" onClick={() => setModal(true)}>
          <span className="icon">
            <img src="/img/creating-proposal/area-icon.svg" alt="" />
          </span>
          <span className="underline"> Выбери на карте</span>
        </div>
      )}

      <Modal size="4xl" isOpen={modal} onClose={() => setModal(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Выбирайте регион покрытия
          </ModalHeader>
          <ModalBody className="mb-6">
            <MemoizedSelectCardYandexMap
              onCoordinateSelect={selectCordinatesForMap}
            />
          </ModalBody>
          {selectedCords ? (
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setModal(false);
                  setSelectedCords(null);
                }}
              >
                Закрыть
              </Button>
              <Button
                color="secondary"
                onPress={() => {
                  dispatch(setCompanyCoordinates(selectedCords));
                  setModal(false);
                }}
              >
                Сохранить
              </Button>
            </ModalFooter>
          ) : null}
        </ModalContent>
      </Modal>
    </>
  );
}

// Create a memoized version of the map component to prevent re-renders
const MemoizedSelectCardYandexMap = memo(SelectCardYandexMap);

export default SelectCordinatesForMapModal;
