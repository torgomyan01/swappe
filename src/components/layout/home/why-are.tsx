import { motion } from "framer-motion";

function WhyAre() {
  return (
    <div id="why-are" className="why-are">
      <div className="wrapper">
        <img src="img/why-are-img1.png" alt="" className="left-img" />
        <img src="img/why-are-img2.png" alt="" className="right-img" />
        <img src="img/why-are-bg.png" alt="" className="circle" />
        <h2>В Swappe ты сможешь</h2>
        <div className="texts">
          <motion.span
            initial="init"
            whileInView="animate"
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              init: {
                scale: 0,
              },
              animate: {
                scale: 1,
              },
            }}
          >
            Найти новые каналы роста своего бизнеса
          </motion.span>
          <img src="img/why-are-icon1.svg" alt="" />
          <motion.span
            initial="init"
            whileInView="animate"
            transition={{
              delay: 0.6,
              duration: 0.5,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              init: {
                scale: 0,
              },
              animate: {
                scale: 1,
              },
            }}
          >
            Стать частью открытого бизнес сообщества
          </motion.span>
          <img src="img/why-are-icon2.svg" alt="" />
          <motion.span
            initial="init"
            whileInView="animate"
            transition={{
              delay: 1.2,
              duration: 0.5,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              init: {
                scale: 0,
              },
              animate: {
                scale: 1,
              },
            }}
          >
            Выгодно обменивать товары или услуги
          </motion.span>
        </div>
        <div className="logo-wrap">
          <motion.img
            initial="init"
            whileInView="animate"
            transition={{
              delay: 1,
              duration: 0.8,
            }}
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              init: {
                scale: 0,
              },
              animate: {
                scale: 1,
              },
            }}
            src="img/big-logo.svg"
            alt=""
          />
          <a href="mailto:info@swappe.ru">info@swappe.ru</a>
        </div>
      </div>
    </div>
  );
}

export default WhyAre;
