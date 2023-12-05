import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  frontmatter: CollectionEntry<"projects">["data"];
  secHeading?: boolean;
}

export default function Project({ frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, description, url, image, canonicalURL } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: title },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6">
      <a
        href={url ? url : canonicalURL}
        target={url ? "_blank" : "_self"}
        rel="noopener noreferrer"
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <Datetime datetime={pubDatetime} />
      {image && (
        <>
          <div className="my-2"></div>
          <img
            src={image}
            alt={title}
            className="mr-2 inline-block align-middle"
            style={{
              width: "100vw",
              height: "200px",
              objectFit: "cover",
            }}
          />
          <div className="my-2"></div>
        </>
      )}
      <p>{description}</p>
    </li>
  );
}
