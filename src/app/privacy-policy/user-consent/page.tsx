"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import RightMenuPrivacy from "@/app/privacy-policy/componenets/right-menu-privacy";
import UserConsent from "@/app/privacy-policy/componenets/user-consent";

function Page() {
  return (
    <MainTemplate>
      <div className="private-police-wrap">
        <div className="wrapper">
          <div className="tab-contents">
            <UserConsent />
          </div>
          <RightMenuPrivacy />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
