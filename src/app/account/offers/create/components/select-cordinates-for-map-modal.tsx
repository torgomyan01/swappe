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

function SelectCordinatesForMapModal() {
  const [modal, setModal] = useState<boolean>(false);
  const [selectedCords, setSelectedCords] = useState<[number, number] | null>(
    null,
  );

  // Use useCallback to memoize the function and prevent re-renders
  const selectCordinatesForMap = useCallback((cords: [number, number]) => {
    setSelectedCords(cords);
  }, []); // Empty dependency array means this function never changes

  return (
    <>
      <span className="creating-title">Регион покрытия</span>
      <div className="area" onClick={() => setModal(true)}>
        <span className="icon">
          <img src="/img/creating-proposal/area-icon.svg" alt="" />
        </span>
        <span className="underline"> Выбери на карте</span>
      </div>

      {selectedCords && (
        <div className="area" onClick={() => setModal(true)}>
          <YMaps>
            <Map defaultState={defaultState} width="100%" height="400px">
              <Placemark geometry={[55.751574, 37.573856]} />
            </Map>
          </YMaps>
        </div>
      )}

      <Modal size="2xl" isOpen={modal} onClose={() => setModal(false)}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Выбирайте регион покрытия
          </ModalHeader>
          <ModalBody>
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
                color="primary"
                onPress={() => {
                  console.log("Selected coordinates:", selectedCords);
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
