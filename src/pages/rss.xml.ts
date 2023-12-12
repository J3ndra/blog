import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import slugify from "@utils/slugify";
import { SITE } from "@config";
import getSortedProjects from "@utils/getSortedProjects";

export async function GET() {
  const posts = await getCollection("blog");
  const projects = await getCollection("projects");
  const sortedPosts = getSortedPosts(posts);
  const sortedProjects = getSortedProjects(projects);

  const blogFeed = sortedPosts.map(({ data }) => ({
    link: `posts/${slugify(data)}`,
    title: data.title,
    description: data.description,
    pubDate: new Date(data.pubDatetime),
  }));

  const projectsFeed = sortedProjects.map(({ data }) => ({
    link: `${data.url}`,
    title: data.title,
    description: data.description,
    pubDate: new Date(data.pubDatetime),
  }));

  const combinedFeed = blogFeed.concat(projectsFeed);

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: combinedFeed,
  });
}
