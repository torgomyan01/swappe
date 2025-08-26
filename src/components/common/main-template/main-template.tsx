import Navbar from "@/components/common/navbar/navbar";
import Footer from "@/components/common/footer/footer";
import { useEffect } from "react";
import { ActionCGetUserCompany } from "@/app/actions/company/get-user-company";
import { setCompany } from "@/redux/user";
import { useDispatch } from "react-redux";

interface IThisProps {
  children?: React.ReactNode;
}

function MainTemplate({ children }: IThisProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    ActionCGetUserCompany().then(({ data }) => {
      dispatch(setCompany(data as any));
    });
  }, []);

  return (
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}

export default MainTemplate;
