"use server";

import { ActionGetCompany } from "@/app/actions/company/get-company";
import CompanyPageReviews from "@/app/company/[id]/reviews/reviews";

type Props = {
  params: Promise<{ id: string }>;
};

async function Profile({ params }: Props) {
  const { id } = await params;

  const company = await ActionGetCompany(+id);

  return <CompanyPageReviews company={company.data as any} />;
}

export default Profile;
