import type { PageKey } from "../content";

/** One entry per kind of page. The build makes a separate script for each, so a page loads only its own code. */
export type RouteKind = PageKey | "case-study" | "project" | "not-found";
export const routeKinds: RouteKind[] = ["home", "about", "experience", "projects", "skills", "contact", "case-study", "project", "not-found"];

export type PageData = { route: PageKey } | { route: "case-study"; slug: string } | { route: "project"; slug: string } | { route: "404" };

export const routeKind = (page: PageData): RouteKind => (page.route === "404" ? "not-found" : page.route);
export const routeSlug = (page: PageData) => ("slug" in page ? page.slug : undefined);
