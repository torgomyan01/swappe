"use client";

import MainTemplate from "@/components/common/main-template/main-template";
import Privacy from "@/app/privacy-policy/componenets/privacy";
import RightMenuPrivacy from "@/app/privacy-policy/componenets/right-menu-privacy";

function Page() {
  return (
    <MainTemplate>
      <div className="private-police-wrap">
        <div className="wrapper">
          <div className="tab-contents">
            <Privacy />
          </div>
          <RightMenuPrivacy />
        </div>
      </div>
    </MainTemplate>
  );
}

export default Page;
