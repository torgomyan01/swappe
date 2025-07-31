import { motion } from "framer-motion";
import { motionOptionText } from "@/utils/consts";

function HomeFaq() {
  const messages = [
    "Это бесплатно?",
    "Сервис будет бесплатным для первых 100 пользователей. Постоянные тарифы для всех пользователей уточняйте у наших менеджеров.",
    "Когда запуск сервиса?",
    "Сервис будет доступен с 1сентября 2025 года.",
    "Что, если я не найду пару?",
    "Давно известно, что внимание читателя при взгляде на макет страницы отвлекается на ее читаемое содержимое.",
    "Могу ли я обменяться несколькими услугами?",
    "Давно известно, что внимание читателя при взгляде на макет страницы отвлекается на ее читаемое содержимое.",
  ];

  return (
    <div className="faq">
      <div className="wrapper">
        <h2>FAQ</h2>
        <div className="chat">
          {messages.map((message, index) => {
            if ((index + 1) % 2 === 1) {
              return (
                <motion.div
                  initial="init"
                  whileInView="animate"
                  transition={{
                    delay: 0.2 * index,
                    duration: 0.5,
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                  variants={motionOptionText}
                  key={`question-${index}`}
                  className="question"
                >
                  <span className="icon">
                    <img src="img/question-icon.png" alt="" />
                  </span>
                  <span className="text">{message}</span>
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  initial="init"
                  whileInView="animate"
                  transition={{
                    delay: 0.2 * index,
                    duration: 0.5,
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                  variants={motionOptionText}
                  key={`answer-${index}`}
                  className="answer"
                >
                  <span className="text">{message}</span>
                  <span className="icon">
                    <img src="img/answer-icon.png" alt="" />
                  </span>
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeFaq;
