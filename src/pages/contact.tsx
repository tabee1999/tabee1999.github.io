import { Contact } from "../components/Contact";
import { Faq } from "../components/Sections";
import { ShieldBand } from "../components/Shield";

export default function ContactPage() {
  return (
    <>
      <Contact level={1} />
      <ShieldBand />
      <Faq />
    </>
  );
}
