import TarifBlock from "@/app/account/tariffs-bonuses/components/tarif-block";
import { ActionGetTariffs } from "@/app/actions/admin/tariff";
import { Modal, ModalBody, ModalContent, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface IThisProps {
  show: boolean;
  onClose: () => void;
}

function ModalViewMyTariff({ show, onClose }: IThisProps) {
  const { data: session }: any = useSession();

  const [tariffs, setTariffs] = useState<ITariff[] | null>(null);

  const [myTariff, setMyTariff] = useState<ITariff | null>(null);

  useEffect(() => {
    const findTariff = tariffs?.find(
      (tariff) => tariff.name === session.user.tariff,
    );

    setMyTariff(findTariff || null);
  }, [session.user.tarif, tariffs]);

  useEffect(() => {
    if (show) {
      ActionGetTariffs().then(({ data }: any) => {
        setTariffs(data);
      });
    }
  }, [session, show]);

  return (
    <Modal size="3xl" isOpen={show} onClose={onClose}>
      <ModalContent>
        <ModalBody className="p-0">
          <div className="popups-wrap">
            <div className="global-popup">
              <div className="tarrif-modal-wrap !rounded-none">
                <div className="info">
                  <a href="#" className="close">
                    <img src="img/close-pop.svg" alt="" />
                  </a>
                  <span>Мой тариф</span>
                  <h3>{myTariff?.title}</h3>
                  <ul className="check-list">
                    {myTariff?.supportText.map((text) => (
                      <li key={`tariff_text_${text}`}>
                        <img src="/img/modals/premium.svg" alt="" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="dostavlen">
                    Действителен до{" "}
                    {new Date(
                      session.user.tariff_end_date,
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex-jsb-s gap-2 mb-4 items-stretch mt-6 px-4">
                  {tariffs ? (
                    tariffs.map((tariff) => (
                      <TarifBlock
                        key={`tarif-block-${tariff.name}`}
                        tariff={tariff}
                      />
                    ))
                  ) : (
                    <div className="flex-jc-c w-full h-[400px]">
                      <Spinner color="secondary" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalViewMyTariff;
