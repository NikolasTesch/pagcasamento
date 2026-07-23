import { redirect } from "next/navigation";
import { WEDDING_DATE } from "@/data/couple";
import ThanksContent from "./ThanksContent";

export default function AgradecimentosPage() {
  const now = new Date();
  const isAfterWedding = now >= WEDDING_DATE;

  if (!isAfterWedding) {
    // Antes do casamento: redireciona para homepage
    redirect("/");
  }

  // Depois do casamento: renderiza o conteúdo da página
  return <ThanksContent />;
}
