import type { CollectionEntry } from "astro:content";

const getSortedProjects = (projects: CollectionEntry<"projects">[]) =>
  projects.sort(
    (a, b) =>
      Math.floor(new Date(b.data.pubDatetime).getTime() / 1000) -
      Math.floor(new Date(a.data.pubDatetime).getTime() / 1000)
  );

export default getSortedProjects;
