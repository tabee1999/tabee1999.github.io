import { projects } from "../content";
import { ProjectPage } from "../components/ProjectPage";

export default function ProjectRoute({ slug }: { slug?: string }) {
  const project = projects.find((p) => p.slug === slug);
  return project ? <ProjectPage project={project} /> : null;
}
