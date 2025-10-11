import { SITE_URL } from "@/utils/consts";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface IThisProps {
  tariff: ITariff;
}

function TarifBlock({ tariff }: IThisProps) {
  const { data: session }: any = useSession();
  const router = useRouter();

  function handleChangeTariff() {
    if (session?.user?.tariff !== tariff.name) {
      router.push(SITE_URL.ACCOUNT_TARIFF + "/" + tariff.name);
    }
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
            <Button className="green-btn disabled" disabled>
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
