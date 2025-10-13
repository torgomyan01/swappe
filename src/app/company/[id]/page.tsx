"use server";

import { ActionGetCompany } from "@/app/actions/company/get-company";
import CompanyPage from "@/app/company/[id]/company";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const company: any = await ActionGetCompany(+id);

  return {
    title: `${company.data?.name} - Swappe`,
    description: "",
    keywords: [],
    // alternates: {
    //   canonical: "https://galamat.kz",
    // },
    // openGraph: {
    //   title: data.data.name,
    //   description: data.data.description?.slice(0, 140),
    //   images: image?.image || "",
    // },
  };
}

async function Profile({ params }: Props) {
  const { id } = await params;

  const company = await ActionGetCompany(+id);
  if (!company?.data) {
    notFound();
  }

  return <CompanyPage company={company.data as any} />;
}

export default Profile;
