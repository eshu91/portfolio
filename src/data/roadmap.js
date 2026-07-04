/**
 * Trajectory Map data. status: 'done' | 'current' | 'planned'
 * 'current' renders as the pulsing star; 'planned' stars stay dim.
 * To add a milestone: append one object - the constellation redraws itself.
 */
export const roadmap = [
  {
    year: 2018,
    title: "+2 Computer Science",
    detail: "Vishwa Adarsha College",
    status: "done",
  },
  {
    year: 2023,
    title: "Flutter Developer Intern",
    detail: "e-Doko @ Quality IT Solutions",
    status: "done",
  },
  {
    year: 2024,
    title: "BCA Graduate",
    detail: "Vishwa Adarsha College",
    status: "done",
  },
  {
    year: 2025,
    title: "Cloud Intern + CS Teacher",
    detail: "Everest IT · shipped Sheets automation suite",
    status: "done",
  },
  {
    year: 2026,
    title: "Azure Fundamentals (AZ-900)",
    detail: "Microsoft certification",
    status: "current",
  },
  {
    year: 2026,
    title: "Azure Administrator (AZ-104)",
    detail: "Microsoft certification",
    status: "planned",
  },
  {
    year: 2026,
    title: "Claude Certified Architect",
    detail: "Anthropic",
    status: "planned",
  },
];
