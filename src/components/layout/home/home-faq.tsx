import { motion } from "framer-motion";
import { motionOptionText } from "@/utils/consts";

function HomeFaq() {
  const messages = [
    "Какая стоимость подписки?",
    "У нас предлагаются два варианта месячной подписки: Лайт за 750 рублей с 5% кэшбэком и Pro за 1740 рублей с аналогичным кэшбэком в 10%. Каждый тариф включает определенное количество размещений объявлений. Можно рассматривать это как инвестирование в свой бизнес, например, как если бы вы купили две чашки кофе по подписке Лайт.",
    "Когда планируется запуск?",
    "Скоро! Мы ожидаем, что запустимся в октябре 2025 года. А пока вы можете brainstorm'ить интересные идеи для сотрудничества, чтобы быть готовыми к старту!",
    "Могу ли я обменяться несколькими услугами?",
    "Да, наша платформа поддерживает как простой бартерный обмен между участниками, так и более сложные формы сотрудничества. Просто найдите подходящее предложение и свяжитесь с интересующим вас бизнесом.",
    "Можно ли зарегистрироваться на подписку, если я самозанятый?",
    "Определенно! Мы поддерживаем креативные партнерства между творческими личностями и бизнесами. Если вы эксперт в своей области или обладаете творческим подходом, мы с радостью вас ждем. Возможно, ваше творчество станет ключевым моментом для развития другого бизнеса.",
    "Какой бизнес может использовать платформу Swappe?",
    "Платформа подойдет как для начинающих предпринимателей, так и для тех, кто уже успешно развивает свой бизнес. Swappe — это пространство для партнерства, креативных идей и формирования новых связей.",
  ];

  return (
    <div id="faq" className="faq">
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
                  <span className="icon min-w-10 h-10">
                    <img
                      src="/img/question-icon.png"
                      alt=""
                      className="min-w-10 h-10"
                    />
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
