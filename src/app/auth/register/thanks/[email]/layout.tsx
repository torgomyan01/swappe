"use server";

export async function generateMetadata() {
  return {
    title: "Swappe - Регистрация",
    description: "",
    keywords: [],
    noindex: true,
  };
}

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
