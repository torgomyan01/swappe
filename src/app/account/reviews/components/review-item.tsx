"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Textarea,
} from "@heroui/react";
import { fileHost, SITE_URL } from "@/utils/consts";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { RandomKey } from "@/utils/helpers";
import React from "react";
import { ActionReportCompanyReview } from "@/app/actions/company_reviews/report";

interface IThisProps {
  review: IReview;
}

function ReviewItem({ review }: IThisProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [reason, setReason] = React.useState<string>("spam");
  const [details, setDetails] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  async function submitReport() {
    setLoading(true);
    await ActionReportCompanyReview(review.id, reason, details || undefined);
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <div className="review-item">
      <div className="top">
        <div className="stars">
          {Array.from({ length: 5 }).map((_, i) =>
            i <= review.count - 1 ? (
              <img key={RandomKey()} src="/img/star.svg" alt="" />
            ) : (
              <img key={RandomKey()} src="/img/star-dubl.svg" alt="" />
            ),
          )}
        </div>
        <div className="new">
          <img src="/img/new-bg.png" alt="" />
          <span>Новый</span>
        </div>
        <div className="dots-wrap">
          <Dropdown
            className="min-w-0 w-fit"
            classNames={{
              content: "w-[60px]",
            }}
          >
            <DropdownTrigger>
              <div className="dots">
                <img src="/img/dots-menu.png" alt="" />
              </div>
            </DropdownTrigger>
            <DropdownMenu>
              {/* <DropdownItem key="new">
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.8607 6.68052C13.0235 6.54102 13.1049 6.47128 13.1347 6.38828C13.1608 6.31543 13.1608 6.23574 13.1347 6.16289C13.1049 6.07989 13.0235 6.01015 12.8607 5.87065L7.21358 1.03023C6.93343 0.790102 6.79335 0.670037 6.67476 0.667095C6.57169 0.664538 6.47324 0.709819 6.40811 0.789738C6.33316 0.881695 6.33316 1.06619 6.33316 1.43517V4.29867C4.91004 4.54764 3.60756 5.26876 2.63963 6.3515C1.58438 7.53193 1.00065 9.05955 0.999828 10.6429V11.0509C1.69939 10.2082 2.57283 9.52659 3.56033 9.05287C4.43096 8.6352 5.3721 8.3878 6.33316 8.3226V11.116C6.33316 11.485 6.33316 11.6695 6.40811 11.7614C6.47324 11.8414 6.57169 11.8866 6.67476 11.8841C6.79335 11.8811 6.93343 11.7611 7.21358 11.5209L12.8607 6.68052Z"
                    stroke="#252525"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </DropdownItem> */}
              <DropdownItem key="report" onPress={() => setIsOpen(true)}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative right-[-5px]"
                >
                  <path
                    d="M3.33337 14.6663V7.25893M3.33337 7.25893V1.7244C3.33337 1.50824 3.51362 1.33301 3.73595 1.33301H5.74981C7.12963 1.33301 8.45293 1.86591 9.42861 2.81449C10.4043 3.76307 11.7276 4.29597 13.1074 4.29597H13.7317C13.8799 4.29597 14 4.41279 14 4.5569V9.78241C14 10.0251 13.7977 10.2219 13.548 10.2219H11.5836C10.2038 10.2219 8.88048 9.68899 7.9048 8.74041C6.92912 7.79184 5.60582 7.25893 4.226 7.25893H3.33337Z"
                    stroke="#C8594B"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <p className="text">{review.review}</p>
      <div className="name-wrap">
        <div className="img">
          <Image
            src={`${fileHost}${review.creater_company.image_path}`}
            alt="company image"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <b>{review.creater_company.name}</b>
        {/*<span>{moment(review.creater_company).format("ll")}</span>*/}
      </div>
      <div className="info">
        <div className="texts">
          <b>{review.offers.name}</b>
          <span>{moment(review.created_at).format("ll")}</span>
          {/*<span>{review.offers.c}</span>*/}
        </div>
        <div className="img-wrap">
          <Link
            href={`${SITE_URL.OFFER}/${review.offers.id}`}
            target="_blank"
            className="w-full h-full"
          >
            <Image
              src={`${fileHost}${review.offers.images[0]}`}
              alt="offer image"
              width={150}
              height={150}
              className="object-cover"
            />
          </Link>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Пожаловаться на отзыв</ModalHeader>
              <ModalBody>
                <RadioGroup
                  label="Причина"
                  value={reason}
                  color="secondary"
                  onValueChange={(val) => setReason(val)}
                >
                  <Radio value="Спам/нерелевантный">Спам/нерелевантный</Radio>
                  <Radio value="Оскорбления/ненависть">
                    Оскорбления/ненависть
                  </Radio>
                  <Radio value="Сексуальный контент">Сексуальный контент</Radio>
                  <Radio value="Ложная информация">Ложная информация</Radio>
                  <Radio value="Другое">Другое</Radio>
                </RadioGroup>
                <Textarea
                  label="Комментарий (необязательно)"
                  placeholder="Уточните подробности"
                  value={details}
                  onValueChange={setDetails}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isDisabled={loading}>
                  Отмена
                </Button>
                <Button
                  color="danger"
                  onPress={submitReport}
                  isLoading={loading}
                >
                  Отправить жалобу
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ReviewItem;
