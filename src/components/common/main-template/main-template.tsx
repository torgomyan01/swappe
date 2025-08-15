import Navbar from "@/components/common/navbar/navbar";
import Footer from "@/components/common/footer/footer";

interface IThisProps {
  children?: React.ReactNode;
}

function MainTemplate({ children }: IThisProps) {
  return (
    <>
      <Navbar />

      {children}

      <Footer />

    </>
  )
}


export default MainTemplate;