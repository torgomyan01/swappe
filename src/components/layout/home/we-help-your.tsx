import { useEffect, useState } from "react";
import clsx from "clsx";
import TariffTabContent from "@/components/layout/home/tariff-tab-content";
import { ActionGetTariffs } from "@/app/actions/admin/tariff";
import { motion } from "framer-motion";

function WeHelpYour() {
  const [tariffs, setTariffs] = useState<ITariff[] | null>(null);

  console.log(tariffs);

  useEffect(() => {
    ActionGetTariffs().then((res) => {
      if (res.status === "ok") {
        setTariffs(res.data as unknown as ITariff[]);
      }
    });
  }, []);

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div id="service" className="level-block">
      {tariffs && (
        <div className="info">
          <h2>Мы помогаем бизнесам найти друг друга</h2>
          <div className="info-wrap">
            <motion.div
              initial="init"
              whileInView="animate"
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                init: { opacity: 0, scale: 0 },
                animate: { opacity: 1, scale: 1 },
              }}
              className="level-info"
            >
              <h3>Уровень выбираешь ты</h3>
              <div className="tabs overflow-x-auto">
                {tariffs.map((item, i) => (
                  <button
                    key={`tabs-${i}`}
                    className={clsx("tab-button", { active: activeTab === i })}
                    onClick={() => setActiveTab(i)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="tab-content-wrap">
                {tariffs[activeTab] ? (
                  <TariffTabContent
                    price={tariffs[activeTab].price}
                    items={tariffs[activeTab].supportText || []}
                  />
                ) : null}
              </div>
            </motion.div>
            <div className="image-wrap w-full max-w-[700px]">
              <img src="img/level-img.webp" alt="pricing cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeHelpYour;
