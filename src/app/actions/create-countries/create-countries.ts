// app/actions/countries/add-countries.ts
"use server";

import { prisma } from "@/lib/prisma";
import axios from "axios";

export async function ActionAddAllCountries() {
  try {
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/arbaev/russia-cities/refs/heads/master/russia-cities.json",
    );

    if (!Array.isArray(data)) {
      throw new Error("Invalid JSON format: expected array");
    }

    let index = 0;

    async function insertNext() {
      if (index >= data.length) {
        console.log("✅ All records inserted!");
        return;
      }

      const item = data[index];

      try {
        await prisma.countries_tb.create({
          data: {
            name: item.name,
            name_alt: item.name_alt,
            label: item.label,
            type: item.type,
            typeShort: item.typeShort,
            contentType: item.contentType,
            okato: item.okato,
            oktmo: item.oktmo,
            isDualName: item.isDualName,
            isCapital: item.isCapital,
            zip: item.zip,
            population: item.population,
            yearFounded: `${item.yearFounded}`,
            yearCityStatus: item.yearCityStatus,
            name_en: item.name_en,
            namecase: item.namecase, // JSON դաշտ
            coords: item.coords, // JSON դաշտ
            timezone: item.timezone, // JSON դաշտ
            region: item.region, // JSON դաշտ
          },
        });

        console.log(`✅ Inserted ${index + 1}/${data.length}`);
      } catch (err: any) {
        console.error(`❌ Failed at index ${index}:`, err.message || err);
      }

      index++;
      setTimeout(insertNext, 200);
    }

    // սկսում ենք
    insertNext();

    return { status: "ok", inserted: "started recursive insert", error: "" };
  } catch (error: any) {
    return {
      status: "error",
      data: [],
      error: error.message || String(error),
    };
  }
}
