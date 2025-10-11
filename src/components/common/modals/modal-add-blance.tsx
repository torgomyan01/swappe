import { useState } from "react";

import { ActionCreatePayment } from "@/app/actions/payment/create-payment";
import {
  Modal,
  NumberInput,
  ModalBody,
  ModalContent,
  Button,
} from "@heroui/react";

interface IThisProps {
  show: boolean;
  onClose: () => void;
}

function ModalAddBlance({ show, onClose }: IThisProps) {
  const [amount, setAmount] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  function handleFillBalance() {
    setIsLoading(true);
    ActionCreatePayment(amount, window.location.href)
      .then(({ data }) => {
        window.location.href = data.confirmation.confirmation_url;
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <Modal size="2xl" isOpen={show} onClose={onClose}>
      <ModalContent className="bg-[#fffcf5]">
        <ModalBody className="p-0">
          <div className="global-popup">
            <div className="form-wrap !max-w-full">
              <img src="/img/modals/illustration2.jpg" alt="" />
              <div className="info-w">
                <div className="prices">
                  <b className="price">Пополнение баланс </b>
                </div>
                <div className="w-full mb-6">
                  <NumberInput
                    className="w-full"
                    classNames={{
                      inputWrapper: "shadow-none",
                    }}
                    label="Напишите сумму"
                    endContent={<span>₽</span>}
                    value={amount}
                    onValueChange={(e) => setAmount(e)}
                  />
                </div>
                <Button
                  className="green-btn"
                  onPress={handleFillBalance}
                  isLoading={isLoading}
                >
                  Пополнить
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ModalAddBlance;
