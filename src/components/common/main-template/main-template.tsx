"use client";

import Navbar from "@/components/common/navbar/navbar";
import Footer from "@/components/common/footer/footer";
import { useEffect } from "react";
import { ActionCGetUserCompany } from "@/app/actions/company/get-user-company";
import { setCompany, setFavorites } from "@/redux/user";
import { useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { ActionGetUserFavorites } from "@/app/actions/favorites/get-user-favorites";
import CookieComponent from "@/components/common/main-template/cookie";


interface IThisProps {
  children?: React.ReactNode;
  footer?: boolean;
  isEmpty?: boolean;
}

function MainTemplate({
  children,
  footer = true,
  isEmpty = false,
}: IThisProps) {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  useEffect(() => {
    ActionCGetUserCompany().then(({ data }) => {
      dispatch(setCompany(data as any));
    });

    if (session) {
      ActionGetUserFavorites().then(({ data }) => {
        dispatch(dispatch(setFavorites(data as IUserFavorite[])));
      });
    }
  }, []);

  return (
    <>
      {!isEmpty && <Navbar />}

      {children}

      {!isEmpty && footer && <Footer />}

      <CookieComponent />
    </>
  );
}

export default MainTemplate;
