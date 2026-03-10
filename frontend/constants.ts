import { BlogPost, SocialLink } from './types';

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Optimizing GROMACS on DigitalOcean Droplets',
    date: '2023-10-15',
    content: `Running molecular dynamics simulations in the cloud can be cost-effective if optimized correctly. 
    
In this post, I explore how to leverage the GitHub Student Pack credits to set up a high-performance compute node using DigitalOcean. 

Key takeaways:
- Use memory-optimized droplets.
- Compile GROMACS with AVX2 support manually.
- Use screen or tmux for long-running jobs.`,
    tags: ['GROMACS', 'Cloud Computing', 'HPC']
  },
  {
    id: '2',
    title: 'Visualizing Protein Folding Trajectories',
    date: '2023-11-02',
    content: `Understanding the folding pathway requires more than just RMSD plots. 
    
I've been experimenting with dimensionality reduction techniques like PCA and t-SNE on trajectory data.
Combining these with traditional .xvg analysis gives a much clearer picture of the free energy landscape.`,
    tags: ['Data Viz', 'Python', 'Bioinformatics']
  }
];

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com', icon: 'github' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
  { platform: 'ResearchGate', url: 'https://researchgate.net', icon: 'book' },
  { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
];

export const RESUME_SUMMARY = `
Researcher specializing in Computational Physics and Bioinformatics.
Proficient in Molecular Dynamics (MD) simulations, Python scripting for data analysis, and full-stack web development for scientific tools.
Passionate about open-source scientific software and reproducible research.
`;