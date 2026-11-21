import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/** Mention « محتوى قيد التحقق » : contenu publié sans relecture (statut `UNVERIFIED`). */
export function UnverifiedNotice({ className }: { className?: string }) {
  const t = useTranslations("Content");

  return (
    <p
      role="note"
      data-testid="unverified-notice"
      className={cn(
        "rounded-md border border-dashed border-ocre bg-white px-4 py-2 text-sm font-bold text-encre",
        className,
      )}
    >
      {t("unverified")}
    </p>
  );
}
