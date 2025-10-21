"use client";

import "@/components/layout/home/home.scss";

import HomeHeader from "@/components/layout/home/header";
import WeHelpYour from "@/components/layout/home/we-help-your";
import BussinesBlock from "@/components/layout/home/bussines-block";
import HomeFaq from "@/components/layout/home/home-faq";
import WhyAre from "@/components/layout/home/why-are";
import Footer from "@/components/common/footer/footer";
import CookieComponent from "@/components/common/main-template/cookie";
import TelegramBlock from "@/components/common/main-template/telegram-block";

function Page() {
  // useEffect(() => {
  //   ActionAddAllCountries().then(({ status }) => {
  //     if (status === "ok") {
  //       console.log("All countries added");
  //     }
  //   });
  // }, []);

  return (
    <>
      <HomeHeader />
      <WeHelpYour />
      <BussinesBlock />

      <HomeFaq />

      <WhyAre />

      <Footer />

      <CookieComponent />

      <TelegramBlock />
    </>
  );
}

export default Page;
