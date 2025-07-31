import "./globals.scss";
import "../icons/icons.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/app/providers";

export async function generateMetadata() {
  return {
    title: "Обменивайтесь услугами, а не деньгами",
    description:
      "Galamat — надёжная недвижимость в столице. Купить квартиру в Астане легко с нами: профессиональный отдел продаж, выгодные предложения и сопровождение сделки.",
    keywords: [],
    // alternates: {
    //   canonical: "https://galamat.kz",
    // },
    // openGraph: {
    //   title: data.data.name,
    //   description: data.data.description?.slice(0, 140),
    //   images: image?.image || "",
    // },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning={true}>
      <body>
        <NextTopLoader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
