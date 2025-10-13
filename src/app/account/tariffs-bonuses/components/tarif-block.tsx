import { SITE_URL } from "@/utils/consts";
import { addToast, Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ActionCancelUserPlan } from "@/app/actions/auth/cancel-user-plan";
import { useState } from "react";

interface IThisProps {
  tariff: ITariff;
}

function TarifBlock({ tariff }: IThisProps) {
  const { data: session, update }: any = useSession();
  const router = useRouter();

  function handleChangeTariff() {
    if (session?.user?.tariff !== tariff.name) {
      router.push(SITE_URL.ACCOUNT_TARIFF + "/" + tariff.name);
    }
  }

  const [loading, setLoading] = useState(false);

  async function handleCancel() {
    setLoading(true);
    const res = await ActionCancelUserPlan();
    if (res.status === "ok") {
      await update({
        tariff: "free",
        tariff_end_date: null,
      });

      addToast({
        title: "Подписка успешно отменена",
        color: "success",
      });

      window.location.reload();
    }

    setLoading(false);
  }

  return (
    <div className="level-info border border-gray-200/80">
      <h3 className="!mb-0">{tariff.title}</h3>
      <div className="tab-content-wrap h-full">
        <div className="tab-content active !flex-jsb-c flex-col h-full">
          <div>
            <b className="price">
              {`${new Intl.NumberFormat("ru-RU").format(tariff.price)} ₽`}
            </b>
            <ul>
              {tariff.supportText.map((text) => (
                <li key={`tarif-text-${text}`}>{text}</li>
              ))}
            </ul>
          </div>

          {tariff.name === session.user.tariff ? (
            <Button
              className="green-btn"
              onPress={handleCancel}
              isLoading={loading}
            >
              Отменить подписку
            </Button>
          ) : (
            <Button className="green-btn" onPress={handleChangeTariff}>
              Присоединиться
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TarifBlock;
