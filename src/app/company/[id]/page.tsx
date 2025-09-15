"use server";

import { ActionGetCompany } from "@/app/actions/company/get-company";
import CompanyPage from "@/app/company/[id]/company";

type Props = {
  params: Promise<{ id: string }>;
};

async function Profile({ params }: Props) {
  const { id } = await params;

  const company = await ActionGetCompany(+id);

  return <CompanyPage company={company.data as any} />;
}

export default Profile;
