"use client";

import "@/components/layout/home/home.scss";

import HomeHeader from "@/components/layout/home/header";
import WeHelpYour from "@/components/layout/home/we-help-your";
import BussinesBlock from "@/components/layout/home/bussines-block";
import HomeFaq from "@/components/layout/home/home-faq";
import WhyAre from "@/components/layout/home/why-are";
import Footer from "@/components/layout/home/footer";

function Page() {
  return (
    <>
      <HomeHeader />
      <WeHelpYour />
      <BussinesBlock />

      <HomeFaq />

      <WhyAre />

      <Footer />
    </>
  );
}

export default Page;
