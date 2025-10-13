"use client";

import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import ChatNewsForm from "./form";

export default function CreateChatNewsModal({
  onAdded,
}: {
  onAdded?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        color="success"
        startContent={<i className="fa-solid fa-plus" />}
        onPress={() => setOpen(true)}
      >
        Добавить новость
      </Button>
      <Modal
        isOpen={open}
        onOpenChange={setOpen}
        size="xl"
        backdrop="blur"
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>Новая чат-новость</ModalHeader>
              <ModalBody>
                <ChatNewsForm
                  onSuccess={() => {
                    setOpen(false);
                    onAdded?.();
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
