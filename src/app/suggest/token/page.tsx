"use client";

import { useEffect } from "react";

export default function YandexTokenPage() {
  useEffect(() => {
    // Handle the token from Yandex OAuth
    const handleToken = () => {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = urlParams.get("access_token");
      const error = urlParams.get("error");
      if (error) {
        console.error("Yandex OAuth error:", error);
        window.close();
        return;
      }
      if (accessToken) {
        // Send the token to the parent window (login page)
        if (window.opener) {
          window.opener.postMessage(
            {
              type: "YANDEX_TOKEN",
              token: accessToken,
            },
            window.location.origin,
          );
        }
        window.close();
      } else {
        window.close();
      }
    };

    handleToken();
  }, []);

  return (
    <div className="main-wrap">
      <div className="wrapper">
        <div className="form-wrap">
          <h2>Обработка авторизации...</h2>
          <p>Пожалуйста, подождите...</p>
        </div>
      </div>
    </div>
  );
}
