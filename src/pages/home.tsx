import { Hero } from "../components/Hero";
import { AITools, Explore, FeaturedProjects, HowIWork } from "../components/Home";
import { TestRunShow } from "../components/TestRunShow";

/** Projects come right after the test run: recruiters see real work within the first few screens. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TestRunShow />
      <FeaturedProjects />
      <HowIWork />
      <AITools />
      <Explore />
    </>
  );
}
