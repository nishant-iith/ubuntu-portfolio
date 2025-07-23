import React, { Component } from 'react';
import ReactGA from 'react-ga4';
import PropTypes from 'prop-types';

export class AboutNishant extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: null,
            active_screen: "about",
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "experience": <Experience />,
            "skills": <Skills />,
            "projects": <Projects />,
            "contact": <Contact />,
        }

        let lastVisitedScreen = null;
        if (typeof window !== "undefined") {
            lastVisitedScreen = localStorage.getItem("about-section");
        }
        if (!lastVisitedScreen) {
            lastVisitedScreen = "about";
        }

        this.setState({
            screen: this.screens[lastVisitedScreen],
            active_screen: lastVisitedScreen
        });
    }

    changeScreen = (e) => {
        const screen = e.id || (e.target && e.target.id);
        if (typeof window !== "undefined") {
            localStorage.setItem("about-section", screen);
        }
        const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
        if (TRACKING_ID) {
            ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: screen });
        }
        if (this.screens[screen]) {
            this.setState({
                screen: this.screens[screen],
                active_screen: screen
            });
        }
    }

    renderQuickLinks = () => {
        const quickLinks = [
            { id: "about", label: "About" },
            { id: "education", label: "Education" },
            { id: "experience", label: "Experience" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "contact", label: "Contact" },
        ];
        return (
            <div className="flex flex-wrap gap-2 mb-6 justify-center w-full bg-[#191b1f] bg-opacity-95 py-3 px-2 rounded-t-lg shadow">
                {quickLinks.map(link => (
                    <button
                        key={link.id}
                        id={link.id}
                        onClick={this.changeScreen}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 border border-[#35363a] 
                            ${this.state.active_screen === link.id
                                ? "bg-gradient-to-r from-[#E95420] to-[#2CBB6B] text-white shadow"
                                : "bg-[#232526] text-[#e0e0e0] hover:bg-ub-orange hover:text-white"}`}
                    >
                        {link.label}
                    </button>
                ))}
            </div>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#232526] to-[#191b1f] text-white select-none relative">
                {/* Only Top Quick Links Row */}
                <div className="w-full px-2 md:px-10 pt-4">
                    {this.renderQuickLinks()}
                </div>
                {/* Main content */}
                <div className="w-full flex-grow flex flex-col items-center animate-fade-in-fast">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

AboutNishant.propTypes = {
    // No props currently, but add here if needed in future
};

export default AboutNishant;

export const displayAboutNishant = () => {
    return <AboutNishant />;
}

// Card and SectionHeader helpers for unified style
const Card = ({ children, className = "" }) => (
    <div className={`bg-[#232526] bg-opacity-95 rounded-xl shadow-lg border border-[#35363a] p-6 ${className}`}>
        {children}
    </div>
);
const SectionHeader = ({ children }) => (
    <h1 className="text-3xl font-bold text-[#E95420] mb-8 tracking-tight drop-shadow">{children}</h1>
);

// Individual screen components

const About = () => {
    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <Card className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar and Socials */}
                    <div className="flex flex-col items-center">
                        <div className="w-36 h-36 md:w-44 md:h-44 bg-[#191b1f] bg-opacity-80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border-4 border-[#232526] mb-4 transition-all duration-200 hover:scale-105">
                            <img
                                src="/images/logos/bitmoji.png"
                                alt="Nishant"
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-[#E95420] shadow"
                                onError={e => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=Nishant&background=E95420&color=fff&size=200"; }}
                            />
                        </div>
                        <div className="flex gap-4 mt-2">
                            <a href="mailto:iith.nishant@gmail.com" title="Email" className="hover:scale-110 transition-transform" target="_blank" rel="noopener noreferrer">
                                <img src="/images/logos/email.svg" alt="email" className="w-7 h-7" />
                            </a>
                            <a href="https://github.com/nishant-iith" target="_blank" rel="noopener noreferrer" title="GitHub" className="hover:scale-110 transition-transform">
                                <img src="/images/logos/github.png" alt="github" className="w-7 h-7" />
                            </a>
                            <a href="https://www.linkedin.com/in/nishant-iith/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="hover:scale-110 transition-transform">
                                <img src="/images/logos/linkedin.svg" alt="linkedin" className="w-7 h-7" />
                            </a>
                            <a href="tel:+919780788073" title="Phone" className="hover:scale-110 transition-transform">
                                <img src="/images/logos/phone.svg" alt="phone" className="w-7 h-7" />
                            </a>
                        </div>
                        {/* Download Resume */}
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-4 py-1.5 rounded-full bg-[#E95420] text-white font-semibold text-xs shadow hover:opacity-90 transition-all"
                        >
                            Download Resume
                        </a>
                    </div>
                    {/* Main Info */}
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-[#E95420] mb-1 tracking-tight">Nishant</h1>
                        <h2 className="text-lg md:text-xl text-[#E95420] font-semibold mb-1">B.Tech Biomedical Engineering @ IIT Hyderabad</h2>
                        <h3 className="text-base md:text-lg text-[#b0b0b0] mb-4">Passionate about software, AI, and making things better.</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-[#E95420] text-white px-3 py-1 rounded-full text-xs font-semibold">Software Engineering</span>
                            <span className="bg-[#E95420] text-white px-3 py-1 rounded-full text-xs font-semibold">Machine Learning</span>
                        </div>
                        <p className="text-[#e0e0e0] leading-relaxed mb-3">
                            Hi! I'm Nishant, a tech enthusiast who loves solving real-world problems. At IIT Hyderabad, I've explored engineering and entrepreneurship, which has helped me understand how technology can truly make a difference.
                        </p>
                        <ul className="list-disc ml-6 text-[#d1d5db] mb-3">
                            <li>
                                {/* Interned at <span className="font-semibold text-[#E95420]">Goldman Sachs</span> and <span className="font-semibold text-[#E95420]">Pentakod</span>, building scalable software solutions. */}
                                Point 1
                            </li>
                            <li>
                                {/* Active as <span className="font-semibold text-[#E95420]">Internship Coordinator</span> (OCS) and <span className="font-semibold text-[#E95420]">Head of Operations</span> (Finance & Consulting Club). */}
                                Point 2
                            </li>
                            <li>
                                Point 3
                            </li>
                        </ul>
                        <p className="text-[#e0e0e0] leading-relaxed mb-3">
                            About me.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-[#35363a] text-white px-3 py-1 rounded-full text-xs">#Teamwork</span>
                            <span className="bg-[#35363a] text-white px-3 py-1 rounded-full text-xs">#Problem Solving</span>
                            <span className="bg-[#35363a] text-white px-3 py-1 rounded-full text-xs">#ContinuousLearning</span>
                        </div>
                    </div>
                </Card>
                {/* Quick Stats */}
                <div className="w-full mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#E95420]">8.27</span>
                        <span className="text-xs text-[#b0b0b0]">CGPA</span>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#E95420]">1</span>
                        <span className="text-xs text-[#b0b0b0]">Major</span>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#E95420]">2</span>
                        <span className="text-xs text-[#b0b0b0]">Internships</span>
                    </Card>
                    <Card className="flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#E95420]">5+</span>
                        <span className="text-xs text-[#b0b0b0]">Projects</span>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Education = () => {
    const educationData = [
        {
            degree: "B.Tech in Biomedical Engineering",
            institute: "IIT Hyderabad",
            grade: "8.27 CGPA"
        },
        {
            degree: "XII (Central Board of Secondary Education)",
            institute: "Godwin Public Senior Secondary School",
            grade: "92.2%"
        },
        {
            degree: "X (Central Board of Secondary Education)",
            institute: "Godwin Public Senior Secondary School",
            grade: "93.2%"
        }
    ];

    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <SectionHeader>Academic Details</SectionHeader>
                <Card className="overflow-x-auto p-0">
                    <table className="w-full rounded-lg">
                        <thead className="bg-[#E95420] text-white">
                            <tr>
                                {/* Removed Year */}
                                <th className="px-6 py-3 text-left">Degree</th>
                                <th className="px-6 py-3 text-left">Institute</th>
                                <th className="px-6 py-3 text-left">CGPA/Marks(%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {educationData.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-[#232526] bg-opacity-80" : "bg-[#191b1f] bg-opacity-80"}>
                                    {/* Removed Year */}
                                    <td className="px-6 py-4 text-[#e0e0e0]">{item.degree}</td>
                                    <td className="px-6 py-4 text-[#e0e0e0]">{item.institute}</td>
                                    <td className="px-6 py-4 text-[#E95420] font-semibold">{item.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

const Experience = () => {
    const experiences = [
        {
            title: "Summer Analyst",
            company: "Goldman Sachs",
            period: "May '25 - July '25",
            description: "Developed a comprehensive web application using React (frontend), Java (backend), and GitLab APIs to automate critical manual processes within the organization. Successfully reduced processing time from days to hours, significantly improving operational efficiency and productivity. Implemented seamless integration between systems, enhancing workflow automation and reducing human error in repetitive tasks."
        },
        {
            title: "Python Developer Intern",
            company: "Pentakod (UK-based startup)",
            period: "June '24 - July '24",
            description: "Part of a team that developed a Python-based port scanner, incorporating network discovery and vulnerability detection. Responsibilities included utilizing provided documentation and Python libraries (socket, scapy) to debug and refine the scanner, ensuring accuracy and efficiency through result comparisons with Nmap."
        }
    ];

    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <SectionHeader>Work Experience</SectionHeader>
                <div className="space-y-6">
                    {experiences.map((exp, index) => (
                        <Card key={index}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#e0e0e0]">{exp.title}</h3>
                                    <h4 className="text-lg text-[#E95420] font-semibold">{exp.company}</h4>
                                </div>
                                <span className="text-sm text-[#b0b0b0] bg-[#232526] px-3 py-1 rounded">{exp.period}</span>
                            </div>
                            <p className="text-[#d1d5db] leading-relaxed">{exp.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Skills = () => {
    const skillCategories = [
        {
            category: "Programming Languages",
            skills: ["C", "C++", "Python", "SQL", "FORTRAN", "MATLAB", "VERILOG", "HTML", "CSS"],
            proficiency: "Efficient in C, C++, Python. Familiar with others."
        },
        {
            category: "Development Tools",
            skills: ["Visual Studio Code", "Jupyter Notebook", "Google Colab", "PyCharm"],
            proficiency: "Experienced"
        },
        {
            category: "Python Libraries",
            skills: ["NumPy", "Pandas", "Matplotlib", "TensorFlow", "Sklearn", "NLTK"],
            proficiency: "Proficient in NumPy, Pandas, Matplotlib. Familiar with ML libraries."
        },
        {
            category: "Other Tools",
            skills: ["Git", "GitHub", "SolidEdge", "LaTeX", "Arduino"],
            proficiency: "Regular usage"
        }
    ];

    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <SectionHeader>Skills</SectionHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {skillCategories.map((category, index) => (
                        <Card key={index}>
                            <h3 className="text-xl font-bold text-[#2CBB6B] mb-4">{category.category}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {category.skills.map((skill, skillIndex) => (
                                    <span key={skillIndex} className="bg-[#35363a] text-[#e0e0e0] px-3 py-1 rounded-full text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            <p className="text-sm text-[#b0b0b0] italic">{category.proficiency}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const projects = [
        {
            title: "Hybrid Convolutional and Long Short-Term Memory Neural Network",
            period: "Semester IV",
            description: "Course Project under Professor Dr. Nagarajan Ganapathy, in a team of two. Implemented a framework for real-time emotion recognition in drivers using multimodal data processing and Convolutional Bi-LSTM model, with responsibilities including data curation, data preprocessing, writing and reviewing the project draft.",
            type: "Academic"
        },
        {
            title: "Comparative Analysis of Data Structures",
            period: "Semester III",
            description: "Course project under Professor Maria Francis and Professor M.V.P. Rao. Implemented BST and AVL trees with hashing for efficient storage and retrieval of Aadhar numbers, and evaluated the performance of insertion, deletion, and search operations.",
            type: "Academic"
        },
        {
            title: "Route Optimization Tool for Urban Navigation",
            period: "Semester III",
            description: "Course project under Professor Dr. Nagarajan Ganapathy, in a team of two. Implemented a city model using undirected graphs, where edge weights represent distances between locations, and implemented Dijkstra's algorithm for efficient route finding.",
            type: "Academic"
        },
        {
            title: "CPU Scheduling Algorithms - Operating System",
            period: "Self-directed",
            description: "Developed CPU scheduling algorithms in C++, including FCFS (First-Come, First-Served), Round Robin, and Shortest Job First. Utilized data structures such as queues and implemented scheduling logic.",
            type: "Personal"
        }
    ];

    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <SectionHeader>Projects</SectionHeader>
                <div className="space-y-6">
                    {projects.map((project, index) => (
                        <Card key={index}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-[#e0e0e0] mb-2">{project.title}</h3>
                                    <div className="flex gap-4 items-center mb-3">
                                        <span className="text-sm text-[#b0b0b0]">{project.period}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${project.type === 'Academic' ? 'bg-[#3B82F6] text-white' : 'bg-[#2CBB6B] text-white'}`}>
                                            {project.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#d1d5db] leading-relaxed">{project.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Contact = () => {
    const contactInfo = [
        { label: "Email (Personal)", value: "iith.nishant@gmail.com", type: "email" },
        { label: "Email (Academic)", value: "bm22btech11013@iith.ac.in", type: "email" },
        { label: "Phone", value: "+91 9780788073", type: "phone" },
        { label: "GitHub", value: "github.com/nishant-iith", type: "link", url: "https://github.com/nishant-iith" }
    ];

    return (
        <div className="w-full h-full overflow-y-auto windowMainScreen bg-gradient-to-br from-[#232526] to-[#191b1f]">
            <div className="w-full flex flex-col p-4 md:p-10">
                <SectionHeader>Contact Information</SectionHeader>
                <Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contactInfo.map((contact, index) => (
                            <div key={index} className="flex flex-col">
                                <label className="text-sm font-semibold text-[#b0b0b0] mb-2">{contact.label}</label>
                                {contact.type === "link" ? (
                                    <a 
                                        href={contact.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[#E95420] hover:text-[#2CBB6B] font-medium"
                                    >
                                        {contact.value}
                                    </a>
                                ) : contact.type === "email" ? (
                                    <a 
                                        href={`mailto:${contact.value}`}
                                        className="text-[#E95420] hover:text-[#2CBB6B] font-medium"
                                    >
                                        {contact.value}
                                    </a>
                                ) : (
                                    <span className="text-[#e0e0e0] font-medium">{contact.value}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-[#35363a]">
                        <h3 className="text-lg font-semibold text-[#2CBB6B] mb-4">Positions of Responsibility</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-[#E95420]">Office of Career Services (Placement Cell)</h4>
                                <p className="text-sm text-[#b0b0b0]">Internship Coordinator (May '24 - Present)</p>
                                <p className="text-sm text-[#b0b0b0]">Data Maintenance and Proctoring Volunteer (July '23 - April '24)</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-[#E95420]">Finance and Consulting Club</h4>
                                <p className="text-sm text-[#b0b0b0]">Head of Operations (May '24 - Present)</p>
                                <p className="text-sm text-[#b0b0b0]">Corporate Partnerships and Growth Coordinator (May '23 - April '24)</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};