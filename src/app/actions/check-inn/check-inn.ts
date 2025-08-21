"use server";

import axios from "axios";

const url =
  "https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party";
const token = process.env.API_KEY_DADATA; // կամ `${API_KEY}` եթե string է

export async function ActionCheckInn(inn: number) {
  try {
    const queryData = await axios.post(
      url,
      { query: inn },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
      },
    );

    return { status: "ok" as const, data: queryData.data };
  } catch (e: any) {
    return { status: "error", error: e };
  }
}
