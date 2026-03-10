import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="bg-[#0B1120]/85 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-xl max-w-6xl mx-auto space-y-10 animate-fade-in pb-16">
      
      {/* Header / Profile Section */}
      <header className="flex flex-col md:flex-row gap-8 items-start border-b border-slate-800 pb-10 mt-10 px-6">
        <div className="flex-1 space-y-5">
            <div>
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-2">
                    Rasulbek <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Mashalov</span>
                </h1>
                <h2 className="text-2xl text-emerald-400 font-mono font-medium">MSc Computer Science Engineering Student</h2>
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-400 font-mono">
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Debrecen, Hungary
                </span>
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    +36 xx xxx xxxx
                </span>
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    rasulbekmashalov.mailbox.unideb.hu
                </span>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed max-w-3xl border-l-4 border-cyan-500/50 pl-6 italic">
                MSc Computer Science Engineering student with a background in <strong className="text-white">Physics</strong> and <strong className="text-white">Molecular Dynamics</strong>. Bridging the gap between biological sciences and informatics, I specialize in using Python, Linux/HPC environments, and AI tools (AlphaFold) to analyze complex biological data. Seeking a research position to apply my skills in data analysis, machine learning, and bioinformatics.
            </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 px-6">
        
        {/* Left Sidebar */}
        <div className="space-y-12">
            {/* Skills */}
            <div className="space-y-8">
                <SkillGroup title="Programming">
                    <SkillTag name="Python" detail="Pandas, NumPy" />
                    <SkillTag name="Java" detail="Foundation" />
                    <SkillTag name="HTML/CSS" />
                </SkillGroup>

                <SkillGroup title="Bio-Informatics">
                    <SkillTag name="GROMACS" />
                    <SkillTag name="AlphaFold2" />
                    <SkillTag name="PyMOL" />
                    <SkillTag name="VMD" />
                    <SkillTag name="ProteinMPNN" />
                </SkillGroup>

                <SkillGroup title="Tools & OS">
                    <SkillTag name="Linux" detail="Fedora/Ubuntu" />
                    <SkillTag name="Git/GitHub" />
                    <SkillTag name="VS Code" />
                    <SkillTag name="VIM" />
                </SkillGroup>

                <SkillGroup title="Languages">
                    <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-1 mb-1">
                        <span>English</span>
                        <span className="text-cyan-400 font-mono">: C1</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-1 mb-1">
                        <span>Russian</span>
                        <span className="text-cyan-400 font-mono">: B2</span>
                    </div>
                     <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-1 mb-1">
                        <span>German</span>
                        <span className="text-cyan-400 font-mono">: B1</span>
                    </div>
                     <div className="flex justify-between text-sm text-slate-300 border-b border-slate-800 pb-1 mb-1">
                        <span>Uzbek</span>
                        <span className="text-cyan-400 font-mono">: Native</span>
                    </div>
                </SkillGroup>
            </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
            
            {/* Education */}
            <Section title="Education">
                <TimelineItem 
                    date="Sep 2025 – Present"
                    title="MSc in Computer Science Engineering"
                    place="University of Debrecen, Hungary"
                    details={['Focus Areas: Machine Learning, Big Data Analysis, Parallel Image Processing']}
                    color="border-l-cyan-500"
                />
                <TimelineItem 
                    date="Sep 2020 – Jul 2024"
                    title="BSc in Physics"
                    place="National University of Uzbekistan"
                    details={['Focus Areas: Theoretical Physics, Molecular Dynamics, Computational Physics']}
                    color="border-l-slate-600"
                />
            </Section>

            {/* Experience */}
            <Section title="Research & Work Experience">
                <TimelineItem 
                    date="Aug 2023 – Aug 2025"
                    title="Research Engineer (Computational Biophysics)"
                    place="Center for Advanced Technologies, Uzbekistan"
                    color="border-l-emerald-500"
                    details={[
                        'Conducted large-scale Molecular Dynamics (MD) simulations using GROMACS on High-Performance Computing (HPC) clusters.',
                        'Developed Python scripts to automate data analysis pipelines and visualize protein stability metrics.',
                        'Acquired foundational knowledge of AlphaFold2 and RF Diffusion for protein structure prediction.',
                        'Co-authored 3 peer-reviewed papers involving the statistical analysis of biological interaction data.'
                    ]}
                />
                 <TimelineItem 
                    date="Sep 2024 – Sep 2025"
                    title="Science Teacher"
                    place="Salam International School, Tashkent"
                    color="border-l-amber-500"
                    details={[
                        'Delivered Physics curriculum in English to secondary school students.',
                        'Developed soft skills in communication and presenting complex scientific concepts to non-experts.'
                    ]}
                />
            </Section>

        {/* Publications */}
        <Section title="Selected Publications">
            <div className="space-y-4">
                <Publication 
                    year="2025"
                    doi="https://doi.org/10.1038/s41598-025-12902-x"
                    title="Molecular dynamics insights into the redox effects on PD-1/PD-L1 and PD-1/PD-L2 interactions"
                    journal="Scientific Reports, vol. 15, Article no. 32909"
                    authors="Rasulbek Mashalov, Zulfizar Toshpulatova, Zhitong Chen, Jamoliddin Razzokov"
                />
                <Publication 
                    year="2025"
                    doi="https://doi.org/10.3389/fphy.2025.1591640"
                    title="Oxidation-induced destabilization of polymorphic α-synuclein fibrils: insights from molecular dynamics"
                    journal="Frontiers in Physics, vol. 13"
                    authors="Tohir Akramov, Parthiban Marimuthu, Mukhriddin Makhkamov, Aamir Shahzad, Rasulbek Mashalov, Jamoliddin Razzokov"
                />
                <Publication 
                    year="2024"
                    doi="https://doi.org/10.1016/j.jsb.2024.108109"
                    title="Exploring α-synuclein stability under the external electrostatic field: Effect of repeat unit"
                    journal="Journal of Structural Biology, vol. 216, 108109"
                    authors="Javokhir Khursandov, Rasulbek Mashalov, Mukhriddin Makhkamov, Farkhad Turgunboev, Avez Sharipov, Jamoliddin Razzokov"
                />
            </div>
        </Section>

            {/* Honors & Certs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Section title="Honours & Conferences">
                    <ul className="space-y-4">
                        <ListItem 
                            date="Sep 2025" 
                            title="Stipendium Hungaricum Scholarship" 
                            desc="Tempus Public Foundation. Full merit-based scholarship." 
                        />
                         <ListItem 
                            date="Nov 2024" 
                            title="Poster Presenter, Innoweek 2024" 
                            desc="Topic: Computational Design of Novel TRPV1 Binders using AI." 
                        />
                        <ListItem 
                            date="Nov 2024" 
                            title="Protein Design School Participant" 
                            desc="Intro to AlphaFold2, ProteinMPNN and RFDiffusion." 
                        />
                    </ul>
                </Section>
                <Section title="Certifications">
                    <ul className="space-y-4">
                        <ListItem 
                            date="Nov 2025" 
                            title="AI for Predictive Maintenance" 
                            desc="NVIDIA Deep Learning Institute" 
                        />
                        <ListItem 
                            date="Nov 2025" 
                            title="Accelerated Data Science" 
                            desc="NVIDIA Deep Learning Institute" 
                        />
                        <ListItem 
                            date="Oct 2025" 
                            title="Fundamentals of Deep Learning" 
                            desc="NVIDIA Deep Learning Institute" 
                        />
                    </ul>
                </Section>
            </div>
        </div>
      </div>
    </div>
  );
};

// --- Subcomponents ---

const Section: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="w-6 h-1 bg-slate-700 rounded-full"></span>
            {title}
        </h3>
        {children}
    </div>
);

const TimelineItem: React.FC<{date: string, title: string, place: string, details: string[], color: string}> = ({date, title, place, details, color}) => (
    <div className={`relative pl-8 pb-8 border-l-2 ${color} last:pb-0`}>
        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${color.replace('border-l-', 'bg-')} border-4 border-slate-900`}></div>
        <div className="text-xs font-mono text-slate-500 mb-1">{date}</div>
        <h4 className="text-lg font-bold text-slate-200">{title}</h4>
        <div className="text-sm text-cyan-400 mb-3">{place}</div>
        <ul className="list-disc list-outside ml-4 space-y-1">
            {details.map((d, i) => (
                <li key={i} className="text-sm text-slate-400 leading-relaxed">{d}</li>
            ))}
        </ul>
    </div>
);

const SkillGroup: React.FC<{title: string, children: React.ReactNode}> = ({title, children}) => (
    <div>
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {children}
        </div>
    </div>
);

const SkillTag: React.FC<{name: string, detail?: string}> = ({name, detail}) => (
    <span className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm transition-colors border border-slate-700">
        <span className="font-medium text-white">{name}</span>
        {detail && <span className="text-slate-500 ml-1 text-xs">({detail})</span>}
    </span>
);

const Publication: React.FC<{year: string, title: string, journal: string, authors: string, doi: string}> = ({year, title, journal, authors, doi}) => (
    <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-all group">
        <div className="flex justify-between items-start mb-2">
            {/* THIS IS THE CLICKABLE LINK PART */}
            <a 
                href={doi} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-md font-bold text-slate-200 leading-snug group-hover:text-cyan-400 transition-colors cursor-pointer"
            >
                {title}
            </a>
            <span className="text-xs font-mono text-cyan-500 bg-cyan-900/20 px-2 py-0.5 rounded border border-cyan-900/50 shrink-0 ml-4">
                {year}
            </span>
        </div>
        <div className="text-sm text-emerald-400/80 mb-2 italic">{journal}</div>
        <div className="text-xs text-slate-500 leading-relaxed">{authors}</div>
        
        {/* OPTIONAL: A small button link at the bottom */}
        <div className="mt-4">
            <a 
                href={doi} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 flex items-center gap-1 uppercase tracking-widest"
            >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                Full Text / DOI
            </a>
        </div>
    </div>
);

const ListItem: React.FC<{date: string, title: string, desc: string}> = ({date, title, desc}) => (
    <li className="flex gap-4">
        <div className="text-xs font-mono text-slate-500 shrink-0 w-16 pt-0.5 text-right">{date.split(' ')[0]} <br/> {date.split(' ')[1]}</div>
        <div>
            <h5 className="text-sm font-bold text-slate-200">{title}</h5>
            <p className="text-xs text-slate-400">{desc}</p>
        </div>
    </li>
);