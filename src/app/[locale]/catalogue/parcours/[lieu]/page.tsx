import { notFound } from "next/navigation";
import { findPlace, parcoursPlaces } from "@/features/parcours/data";
import { ParcoursLieu } from "@/features/parcours/lieu";

// Lieux factices connus au build ; tout autre segment est une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return parcoursPlaces.map((place) => ({ lieu: place.id }));
}

export default async function ParcoursLieuPage({
  params,
}: PageProps<"/[locale]/catalogue/parcours/[lieu]">) {
  const place = findPlace((await params).lieu);
  if (!place) notFound();
  return <ParcoursLieu place={place} />;
}
