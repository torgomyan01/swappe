import { prisma } from "@/lib/prisma";
import { encodeSecretString } from "@/utils/helpers";
import axios from "axios";

export async function ActionGetYandexUserInfo(access_token: string) {
  try {
    const user = await axios.get(
      "https://login.yandex.ru/info?format=json&oauth_token=" +
        access_token +
        "&client_id=" +
        process.env.YANDEX_CLIENT_ID,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return {
      status: "ok",
      data: {
        email: user.data.default_email,
        name: user.data.display_name,
        login: user.data.login,
        password: encodeSecretString(user.data.default_email),
      },
      error: "",
    };
  } catch (error) {
    return {
      status: "error",
      data: null,
      error: "Не удалось выполнить операцию. Повторите попытку позже",
    };
  }
}
