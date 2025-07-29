import "./globals.scss";
import "../icons/icons.css";
import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/app/providers";

export async function generateMetadata() {
  return {
    title: "Купить квартиру в Астане — Galamat | Отдел продаж недвижимости",
    description:
      "Galamat — надёжная недвижимость в столице. Купить квартиру в Астане легко с нами: профессиональный отдел продаж, выгодные предложения и сопровождение сделки.",
    keywords: [
      "купить квартиру в Астане",
      "новостройки Астана",
      "недвижимость в Астане",
      "1-комнатная квартира Астана",
      "2-комнатная квартира Астана",
      "3-комнатная квартира Астана",
      "4-комнатная квартира Астана",
      "квартира в ипотеку Астана",
      "квартира в рассрочку Астана",
      "дешевые квартиры Астана",
    ],
    alternates: {
      canonical: "https://galamat.kz",
    },
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
