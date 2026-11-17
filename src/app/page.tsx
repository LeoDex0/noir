import { Hero } from "@/components/Hero";
import { Prologue } from "@/components/Prologue";
import { Menu } from "@/components/Menu";
import { Philosophy } from "@/components/Philosophy";
import { Chef } from "@/components/Chef";
import { Room } from "@/components/Room";
import { Gallery } from "@/components/Gallery";
import { Reserve } from "@/components/Reserve";
import { Visit } from "@/components/Visit";

/* The calendar is rendered on the server with today's date, refreshed every hour. */
export const revalidate = 3600;

export default function Home() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <main id="main">
        <Hero />
        <Prologue />
        <Menu />
        <Philosophy />
        <Chef />
        <Room />
        <Gallery />
        <Reserve initialToday={today} />
      </main>
      <Visit />
    </>
  );
}
