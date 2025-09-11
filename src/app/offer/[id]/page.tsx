"use server";

import OfferPage from "@/app/offer/[id]/offer";
import type { Metadata } from "next";

import "../../account/offers/create/_creating-proposal.scss";
import "./_complain.scss";
import { getOffer } from "@/lib/get-offer";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const offer: any = await getOffer(id ? +id : 0);

  return {
    title: offer ? offer?.name : "Swappe",
  };
}

async function Offer({ params }: Props) {
  const { id } = await params;

  const offer = await getOffer(id ? +id : 0);

  // Եթե IUserOfferFront-ը գլոբալ տիպ չէ, համոզվեք, որ այն ներմուծված է
  // Օրինակ՝ import { IUserOfferFront } from "@/types/user-offer";
  return <OfferPage offer={offer as IUserOfferFront} />;
}

export default Offer;
