import { useState } from "react";
import clsx from "clsx";
import TabContentFree from "@/components/layout/home/tab-content-free";
import TabContentPrice from "@/components/layout/home/tab-content-price";
import { motion } from "framer-motion";

function WeHelpYour() {
  const tabItems = [
    {
      name: "Базовый",
      component: <TabContentFree />,
    },
    {
      name: "Продвинутый",
      component: <TabContentPrice />,
    },
  ];

  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className="level-block">
      <div className="info">
        <h2>Мы помогаем бизнесам найти друг друга</h2>
        <div className="info-wrap">
          <motion.div
            initial="init"
            whileInView="animate"
            transition={{
              duration: 0.5,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              init: {
                opacity: 0,
                scale: 0,
              },
              animate: {
                opacity: 1,
                scale: 1,
              },
            }}
            className="level-info"
          >
            <h3>Уровень выбираешь ты</h3>
            <div className="tabs">
              {tabItems.map((item, i) => (
                <button
                  key={`tabs-${i}`}
                  className={clsx("tab-button", {
                    active: activeTab === i,
                  })}
                  onClick={() => setActiveTab(i)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="tab-content-wrap">
              {tabItems[activeTab].component}
            </div>
          </motion.div>
          <div className="image-wrap w-full max-w-[700px]">
            <img src="img/level-img.webp" alt="pricing cover" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeHelpYour;
