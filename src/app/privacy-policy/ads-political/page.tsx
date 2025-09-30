"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import RightMenuPrivacy from "@/app/privacy-policy/componenets/right-menu-privacy";
import AdvertisingConsent from "@/app/privacy-policy/componenets/advertising-consent";

function Page() {
  return (
    <MainTemplate>
      <div className="private-police-wrap">
        <div className="wrapper">
          <div className="tab-contents">
            <AdvertisingConsent />
          </div>
          <RightMenuPrivacy />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
