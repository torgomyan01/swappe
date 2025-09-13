import { cache } from "./cache";
import { ActionSingleOffer } from "@/app/actions/offers/get-single";

export async function getOffer(id: number) {
  const CACHE_KEY = `offer-single${id}`;

  const cached = cache.get(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const getOffer = await ActionSingleOffer(id);

    cache.set(CACHE_KEY, getOffer.data);
    return getOffer.data;
  } catch {
    return [];
  }
}
