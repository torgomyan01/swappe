"use server";

export async function generateMetadata() {
  return {
    title: "Swappe - Регистрация",
    description: "",
    keywords: [],
  };
}

function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default Layout;
