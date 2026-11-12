import { faqs, school } from "@/lib/alvas";
import { getAllPosts, isAlvasPost } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// A plain-text guide for AI assistants and answer engines (llms.txt convention).
export function GET() {
  const posts = getAllPosts();
  const alvas = posts.filter(isAlvasPost);
  const other = posts.filter((p) => !isAlvasPost(p)).slice(0, 15);
  const line = (p: (typeof posts)[number]) => `- [${p.title}](${site.url}/news/${p.slug}): ${p.excerpt}`;

  const body = `# ${site.name}

> ${site.description}

${site.name} is a Mangaluru-based news site. Its main education focus is ${school.name}, Moodbidri (${school.foundation}). It also covers SSLC and II PUC results, Alva's Nudisiri-Virasat, and wider news from coastal Karnataka.

## ${school.name} – key facts

- Official website: ${school.officialUrl}
- Profile page: ${site.url}${school.path}
- Address: ${school.address.street}, ${school.address.locality} – ${school.address.postalCode}, ${school.address.district}, ${school.address.region}, India
- Run by: ${school.foundation} (chairman ${school.chairman})
- Started: ${school.established}
- Medium: English; students write the SSLC (Class 10) exam
- Class size: up to 35 students
- SSLC: 100% results in the first five batches (2012–16); 99.15% (English Medium, 2017). Highest score 624/625 by Pranshula Prashanth (2018, 2nd in Karnataka); 622 by Shadhvi P V in SSLC 2026
- Facilities: IIT foundation coaching, hostels for boys and girls, 400 m synthetic track, 24x7 medical facility, transport
- Admissions contact: ${school.phones[0]}, ${school.email}

## Frequently asked questions

${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Alva's stories

${alvas.map(line).join("\n")}

## Other coastal Karnataka stories

${other.map(line).join("\n")}

## More

- [All stories](${site.url}/magazine)
- [Sitemap](${site.url}/sitemap.xml)
- [RSS feed](${site.url}/feed.xml)
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
