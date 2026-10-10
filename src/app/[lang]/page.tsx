import { notFound } from "next/navigation";
import { profile } from "@/data/profile";
import { isLocale } from "@/i18n/config";
import { getContent } from "@/i18n/content";
import { getDictionary } from "@/i18n/ui";
import { ChatWidget } from "@/components/chat-widget";
import { Contact, Footer } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { Pricing } from "@/components/pricing";
import { Process } from "@/components/process";
import { Projects } from "@/components/projects";
import { Services } from "@/components/services";
import { Skills } from "@/components/skills";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = getDictionary(lang);
  const c = getContent(lang);

  return (
    <>
      <Navbar t={t} locale={lang} />
      <main className="flex-1">
        <Hero t={t} c={c} />
        <Services t={t} c={c} />
        <Projects t={t} c={c} />
        <Process t={t} c={c} />
        <Pricing t={t} c={c} />
        <Skills t={t} />
        <Contact t={t} c={c} locale={lang} />
      </main>
      <Footer t={t} />
      <ChatWidget ownerName={profile.name} locale={lang} t={t.chat} />
    </>
  );
}
