export const SITE_URL = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REGISTER_THANKS: "/auth/register/thanks",
  FORGOT_PASSWORD: "/auth/forgot-password",
  FORGOT_PASSWORD_CHECK: "/auth/forgot-password/check",
  CHANGE_EMAIL: "/auth/change-email/check",
  VERIFY_USER: "/auth/verify-user",
  VERIFY_USER_EMAIL: "/auth/verify-user-email",
  ACCOUNT: "/account",
  OFFER: "/offer",
  SEARCH: "/search",
  PROPOSAL: "/proposal",
  PROPOSAL_: "/proposal/create",
  ACCOUNT_REVIEWS: "/account/reviews",
  ACCOUNT_CHANGE: "/account/change",
  ACCOUNT_FAVORITES: "/account/favorites",
  ACCOUNT_TRANSACTIONS: "/account/transactions",
  ACCOUNT_SUGGESTIONS: "/account/offers",
  ACCOUNT_OFFER_CREATE: "/account/offers/create",
  ACCOUNT_TARIFFS_BONUSES: "/account/tariffs-bonuses",

  CHAT: "/im",

  PRIVACY_POLICY: "/privacy-policy",
  PRIVACY_POLICY_REGARDING: "/privacy-policy/policy-regarding",
  PRIVACY_POLICY_OFFER: "/privacy-policy/offer",
  PRIVACY_POLICY_USER_CONSENT: "/privacy-policy/user-consent",
  PRIVACY_POLICY_ADS_POLITICAL: "/privacy-policy/ads-political",

  COMPANY_CREATE: "/company/create",
  COMPANY_THANKS: "/company/thanks",
  COMPANY: (id: number | string) => `/company/${id}`,
  COMPANY_OFFERS: (id: number | string) => `/company/${id}/offers`,
  COMPANY_REVIEWS: (id: number | string) => `/company/${id}/reviews`,
};

export const fileHost = "https://2410924f2b33.hosting.myjino.ru/";
export const fileHostUpload =
  "https://2410924f2b33.hosting.myjino.ru/save-images.php";
export const fileHostUploadDoc =
  "https://2410924f2b33.hosting.myjino.ru/upload-doc-file.php";
export const fileHostRemove =
  "https://2410924f2b33.hosting.myjino.ru/remove-image.php";

export const localStorageKeys = {
  tokenData: "tokenData",
  tokenTime: "tokenTime",
  tokenAdmin: "tokenAdmin",
  userAdmin: "userAdmin",
  languages: "languages",
  cookieComplete: "cookieComplete",
};

export const motionOptionText = {
  init: {
    opacity: 0,
    y: "30px",
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};
