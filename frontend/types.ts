export interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string; // Markdown-like content
  tags: string[];
}

export interface XVGDataPoint {
  x: number;
  y: number;
  [key: string]: number; // Allow for multiple columns
}

export interface XVGDataset {
  title: string;
  xaxis: string;
  yaxis: string;
  data: XVGDataPoint[];
  legends: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // Tailwind class or lucide-react name (simulated with string)
}

export enum ResearchInterest {
  MD_SIMULATION = "MD Simulation",
  BIOINFORMATICS = "Bioinformatics",
  COMP_PHYSICS = "Comp. Physics",
  CODING = "Scientific Coding"
}