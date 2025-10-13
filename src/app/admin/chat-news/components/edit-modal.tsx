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

export default function EditChatNewsModal({
  item,
  onSaved,
}: {
  item: IChatNews;
  onSaved?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="flat"
        className="min-w-8"
        onPress={() => setOpen(true)}
      >
        <i className="fa-solid fa-pen" />
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
              <ModalHeader>Редактирование чат-новости</ModalHeader>
              <ModalBody>
                <ChatNewsForm
                  item={item}
                  onSuccess={() => {
                    setOpen(false);
                    onSaved?.();
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
