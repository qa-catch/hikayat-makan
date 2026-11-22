import { notFound } from "next/navigation";
import { findPlace, parcoursPlaces } from "@/features/parcours/data";
import { ParcoursHistoire } from "@/features/parcours/histoire";

// Lieux factices connus au build ; tout autre segment est une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return parcoursPlaces.map((place) => ({ lieu: place.id }));
}

export default async function ParcoursHistoirePage({
  params,
}: PageProps<"/[locale]/catalogue/parcours/[lieu]/histoire">) {
  const place = findPlace((await params).lieu);
  if (!place) notFound();
  return <ParcoursHistoire place={place} />;
}
