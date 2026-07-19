export interface CareerRole {
  title: string;
  team: string;
  location: string;
  summary: string;
}

export const FALLBACK_CAREER_ROLES: CareerRole[] = [
  {
    title: "Site Reliability Engineer",
    team: "Cloud Infrastructure",
    location: "Remote / Hybrid",
    summary:
      "Own reliability, observability, incident response and automation across Helios GPU infrastructure.",
  },
  {
    title: "Customer Success Engineer",
    team: "Customer Experience",
    location: "Remote / Hybrid",
    summary:
      "Help customers plan deployments, launch workloads and get dependable performance from Helios infrastructure.",
  },
  {
    title: "Data Center Deployment Engineer",
    team: "Infrastructure",
    location: "On-site / Travel",
    summary:
      "Coordinate rack, power, cooling, networking, validation and handoff for new GPU deployments.",
  },
];

export const careerApplicationHref = (role: CareerRole) =>
  `/contact?service=others&message=${encodeURIComponent(
    `I'm interested in the ${role.title} role. My relevant experience and links are:`,
  )}`;

export const generalCareerApplicationHref =
  `/contact?service=others&message=${encodeURIComponent(
    "I'm interested in joining Helios. My area of expertise and relevant experience are:",
  )}`;
