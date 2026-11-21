import { CaseStudies } from "../components/CaseStudies";
import { Projects } from "../components/Projects";

export default function ProjectsPage() {
  return (
    <>
      <Projects level={1} />
      <CaseStudies />
    </>
  );
}
