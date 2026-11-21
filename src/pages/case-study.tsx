import { caseStudies } from "../content";
import { CaseStudyPage } from "../components/CaseStudies";

export default function CaseStudyRoute({ slug }: { slug?: string }) {
  const study = caseStudies.find((c) => c.slug === slug);
  return study ? <CaseStudyPage study={study} /> : null;
}
