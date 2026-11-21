import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Liens et chemin sans préfixe de langue : next-intl ajoute `/ar` (localePrefix « always »).
export const { Link, usePathname } = createNavigation(routing);
