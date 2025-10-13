"use server";

export async function generateMetadata() {
  return {
    title: "Swappe - Логин",
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

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
