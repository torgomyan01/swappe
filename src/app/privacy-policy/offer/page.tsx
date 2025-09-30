"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import RightMenuPrivacy from "@/app/privacy-policy/componenets/right-menu-privacy";
import Offer from "@/app/privacy-policy/componenets/offer";

function Page() {
  return (
    <MainTemplate>
      <div className="private-police-wrap">
        <div className="wrapper">
          <div className="tab-contents">
            <Offer />
          </div>
          <RightMenuPrivacy />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
