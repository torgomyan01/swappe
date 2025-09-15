import "./globals.scss";
import "../icons/icons.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./tailwind.css";

import NextTopLoader from "nextjs-toploader";

import { Providers } from "@/app/providers";
import { UiProviders } from "@/components/common/UIProvider/ui-provider";
import { SesProviders } from "@/components/common/session-provider/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function generateMetadata() {
  return {
    title: "Swappe - Обменивайтесь услугами, а не деньгами",
    description: "",
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
  const session = await getServerSession(authOptions);
  return (
    <html lang="ru" suppressHydrationWarning={true}>
      <body>
        <SesProviders session={session}>
          <NextTopLoader />
          <Providers>
            <UiProviders>{children}</UiProviders>
          </Providers>
        </SesProviders>
      </body>
    </html>
  );
}
