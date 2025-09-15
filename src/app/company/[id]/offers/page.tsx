"use server";

import { ActionGetCompany } from "@/app/actions/company/get-company";
import CompanyPageOffers from "@/app/company/[id]/offers/offers";

type Props = {
  params: Promise<{ id: string }>;
};

async function Profile({ params }: Props) {
  const { id } = await params;

  const company = await ActionGetCompany(+id);

  return <CompanyPageOffers company={company.data as any} />;
}

export default Profile;
