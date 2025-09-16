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
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "skills": <Skills />,
            "projects": <Projects />,
            "experience": <Experience />,
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

    render() {
        const menuItems = [
            { id: "about", label: "About" },
            { id: "education", label: "Education" },
            { id: "skills", label: "Skills" },
            { id: "projects", label: "Projects" },
            { id: "experience", label: "Experience" },
            { id: "contact", label: "Contact" },
        ];

        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
                {/* Simple Navigation */}
                <div className="w-full bg-ub-grey border-b border-gray-600">
                    <div className="flex flex-wrap gap-1 p-4">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                id={item.id}
                                onClick={this.changeScreen}
                                className={`px-4 py-2 rounded text-sm font-medium transition-colors
                                    ${this.state.active_screen === item.id
                                        ? "bg-ub-orange text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

// About Section
const About = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
                <div className="flex flex-col items-center">
                    <img
                        src="/images/logos/bitmoji.png"
                        alt="Nishant"
                        className="w-32 h-32 rounded-full border-4 border-ub-orange shadow-lg"
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = "https://ui-avatars.com/api/?name=Nishant&background=E95420&color=fff&size=128";
                        }}
                    />
                    <div className="flex gap-4 mt-4">
                        <a href="mailto:iith.nishant@gmail.com" className="hover:scale-110 transition-transform">
                            <img src="/images/logos/email.svg" alt="email" className="w-6 h-6" />
                        </a>
                        <a href="https://github.com/nishant-iith" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/images/logos/github.png" alt="github" className="w-6 h-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/nishant-iith/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <img src="/images/logos/linkedin.svg" alt="linkedin" className="w-6 h-6" />
                        </a>
                    </div>
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 px-4 py-2 bg-ub-orange text-white rounded font-medium hover:opacity-90 transition-opacity"
                    >
                        Download Resume
                    </a>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-ub-orange mb-2">Nishant</h1>
                    <h2 className="text-xl text-gray-300 mb-4">B.Tech Biomedical Engineering @ IIT Hyderabad</h2>
                    <h3 className="text-lg text-gray-400 mb-6">Software Developer | AI/ML Enthusiast | Instructor</h3>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Hi! I'm a 4th-year B.Tech student at IIT Hyderabad passionate about building impactful technology solutions.
                        I love combining technical expertise with real-world problem solving.
                    </p>

                    <div className="space-y-2 text-gray-300">
                        <p>• Completed internship at <span className="text-ub-orange font-semibold">Goldman Sachs</span> working on automation tools</p>
                        <p>• Currently <span className="text-ub-orange font-semibold">Outreach Coordinator</span> at Office of Career Services</p>
                        <p>• Teaching 45+ students as <span className="text-ub-orange font-semibold">Instructor at 10xscale.in</span></p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-ub-grey p-4 rounded text-center border border-gray-600">
                    <div className="text-2xl font-bold text-ub-orange">8.20</div>
                    <div className="text-sm text-gray-400">CGPA</div>
                </div>
                <div className="bg-ub-grey p-4 rounded text-center border border-gray-600">
                    <div className="text-2xl font-bold text-ub-orange">45+</div>
                    <div className="text-sm text-gray-400">Students Taught</div>
                </div>
                <div className="bg-ub-grey p-4 rounded text-center border border-gray-600">
                    <div className="text-2xl font-bold text-ub-orange">3</div>
                    <div className="text-sm text-gray-400">Work Experiences</div>
                </div>
                <div className="bg-ub-grey p-4 rounded text-center border border-gray-600">
                    <div className="text-2xl font-bold text-ub-orange">10+</div>
                    <div className="text-sm text-gray-400">Projects</div>
                </div>
            </div>
        </div>
    );
};

// Education Section
const Education = () => {
    const education = [
        {
            degree: "B.Tech in Biomedical Engineering",
            institute: "Indian Institute of Technology Hyderabad",
            grade: "8.20 CGPA",
            year: "2022 - 2026"
        },
        {
            degree: "XII (Central Board of Secondary Education)",
            institute: "Godwin Public Senior Secondary School",
            grade: "92.20%"
        },
        {
            degree: "X (Central Board of Secondary Education)",
            institute: "Godwin Public Senior Secondary School",
            grade: "93.20%"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ub-orange mb-6">Education</h2>

            <div className="space-y-4">
                {education.map((edu, index) => (
                    <div key={index} className="bg-ub-grey p-6 rounded border border-gray-600">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                                <p className="text-gray-300">{edu.institute}</p>
                                {edu.year && <p className="text-gray-400 text-sm">{edu.year}</p>}
                            </div>
                            <div className="mt-2 md:mt-0">
                                <span className="bg-ub-orange text-white px-3 py-1 rounded text-sm font-medium">
                                    {edu.grade}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Skills Section
const Skills = () => {
    const skillCategories = [
        {
            title: "Programming Languages",
            skills: ["Python", "C++", "C", "Java", "JavaScript", "TypeScript", "SQL"]
        },
        {
            title: "Web Development",
            skills: ["React", "Node.js", "Express", "MongoDB", "HTML/CSS", "REST APIs"]
        },
        {
            title: "AI/ML & Data Science",
            skills: ["TensorFlow", "Keras", "NumPy", "Pandas", "Matplotlib", "OpenCV", "scikit-learn"]
        },
        {
            title: "Tools & Platforms",
            skills: ["Git/GitHub", "GitLab", "VS Code", "IntelliJ IDEA", "Jupyter", "LaTeX"]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ub-orange mb-6">Skills & Technologies</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {skillCategories.map((category, index) => (
                    <div key={index} className="bg-ub-grey p-6 rounded border border-gray-600">
                        <h3 className="text-xl font-semibold text-ub-orange mb-4">{category.title}</h3>
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                                <span key={skillIndex} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-ub-grey p-6 rounded border border-gray-600">
                <h3 className="text-xl font-semibold text-ub-orange mb-4">Computer Science Fundamentals</h3>
                <div className="flex flex-wrap gap-2">
                    {["Data Structures & Algorithms", "Object-Oriented Programming", "System Design", "Operating Systems", "Database Management", "Computer Networks"].map((skill, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Projects Section
const Projects = () => {
    const projects = [
        {
            title: "AI-Powered Website Builder",
            period: "January 2025 - April 2025",
            description: "Built a full-stack AI website generator using OpenRouter API with DeepSeek LLM that converts natural language prompts into functional React applications.",
            tech: ["TypeScript", "React", "Node.js", "OpenRouter API"],
            type: "Personal"
        },
        {
            title: "Hybrid Convolutional Bi-LSTM Emotion Recognition",
            period: "January 2024 - April 2024",
            description: "Collaborated with Dr. Nagarajan Ganapathy to design a real-time driver emotion recognition framework using multimodal data processing. Achieved 84.3% test accuracy.",
            tech: ["Python", "TensorFlow", "Keras", "OpenCV"],
            type: "Academic"
        },
        {
            title: "Data Structures Performance Analysis",
            period: "Semester III",
            description: "Comprehensive comparison of BST and AVL trees with hashing for efficient data storage and retrieval operations.",
            tech: ["C++", "Data Structures"],
            type: "Academic"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ub-orange mb-6">Projects</h2>

            <div className="space-y-6">
                {projects.map((project, index) => (
                    <div key={index} className="bg-ub-grey p-6 rounded border border-gray-600">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                                <p className="text-gray-400 text-sm">{project.period}</p>
                            </div>
                            <span className={`mt-2 md:mt-0 px-3 py-1 rounded text-sm font-medium ${
                                project.type === 'Academic' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                            }`}>
                                {project.type}
                            </span>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((tech, i) => (
                                <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Experience Section
const Experience = () => {
    const experiences = [
        {
            title: "Software Development Engineer (Summer Analyst)",
            company: "Goldman Sachs",
            period: "May 2025 - July 2025",
            location: "Hyderabad",
            description: "Built a full-stack web application to replace a multistep manual deployment workflow, cutting change lead time by ≈99.1% (from ~3 weeks to ~6 hours). Grew active users from 200 to 4,000+ within 2 weeks.",
            tech: ["React", "Java", "MongoDB", "GitLab APIs"]
        },
        {
            title: "Instructor/Trainer",
            company: "10xscale.in",
            period: "August 2024 - April 2025",
            location: "Remote",
            description: "Taught DS&A, Data Science, AI/ML basics, and Python/C++ to 45+ students via live sessions, hands-on labs, and weekly goals. Conducted mock interviews and code reviews.",
            tech: ["Python", "C++", "Data Structures", "Algorithms"]
        },
        {
            title: "Python Developer Intern",
            company: "Pentakod (UK-based startup)",
            period: "June 2024 - July 2024",
            location: "Remote",
            description: "Part of a team that developed a Python-based port scanner with network discovery and vulnerability detection. Utilized Python libraries to debug and refine the scanner.",
            tech: ["Python", "Socket Programming", "Scapy"]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ub-orange mb-6">Work Experience</h2>

            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <div key={index} className="bg-ub-grey p-6 rounded border border-gray-600">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-ub-orange">{exp.title}</h3>
                                <p className="text-lg text-white font-medium">{exp.company}</p>
                                <p className="text-gray-400">{exp.location}</p>
                            </div>
                            <span className="mt-2 md:mt-0 bg-ub-orange text-white px-3 py-1 rounded text-sm font-medium">
                                {exp.period}
                            </span>
                        </div>

                        <p className="text-gray-300 mb-4 leading-relaxed">{exp.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {exp.tech.map((tech, i) => (
                                <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Contact Section
const Contact = () => {
    const contactInfo = [
        { label: "Personal Email", value: "iith.nishant@gmail.com", type: "email" },
        { label: "Academic Email", value: "bm22btech11013@iith.ac.in", type: "email" },
        { label: "Phone", value: "+91 9780788073", type: "phone" },
        { label: "LinkedIn", value: "linkedin.com/in/nishant-iith", type: "link", url: "https://www.linkedin.com/in/nishant-iith/" },
        { label: "GitHub", value: "github.com/nishant-iith", type: "link", url: "https://github.com/nishant-iith" }
    ];

    const positions = [
        {
            org: "Office of Career Services (Placement Cell)",
            roles: ["Outreach Coordinator (2025-26)", "Internship Coordinator (2024-25)"]
        },
        {
            org: "Finance and Consulting Club",
            roles: ["Head of Operations (2024-25)", "Corporate Partnerships & Growth Coordinator (2023-24)"]
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ub-orange mb-6">Contact Information</h2>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-ub-grey p-6 rounded border border-gray-600">
                    <h3 className="text-xl font-semibold text-ub-orange mb-4">Get In Touch</h3>
                    <div className="space-y-3">
                        {contactInfo.map((contact, index) => (
                            <div key={index}>
                                <label className="text-sm text-gray-400">{contact.label}</label>
                                {contact.type === "link" ? (
                                    <a href={contact.url} target="_blank" rel="noopener noreferrer"
                                       className="block text-ub-orange hover:text-orange-300">
                                        {contact.value}
                                    </a>
                                ) : contact.type === "email" ? (
                                    <a href={`mailto:${contact.value}`}
                                       className="block text-ub-orange hover:text-orange-300">
                                        {contact.value}
                                    </a>
                                ) : (
                                    <p className="text-white">{contact.value}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-ub-grey p-6 rounded border border-gray-600">
                    <h3 className="text-xl font-semibold text-ub-orange mb-4">Leadership Positions</h3>
                    <div className="space-y-4">
                        {positions.map((position, index) => (
                            <div key={index}>
                                <h4 className="font-semibold text-white">{position.org}</h4>
                                {position.roles.map((role, i) => (
                                    <p key={i} className="text-sm text-gray-300">{role}</p>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <h4 className="font-semibold text-white mb-2">Achievements</h4>
                        <p className="text-sm text-gray-300">National Cadet Corps: Gold Medal, CATC 2018</p>
                        <p className="text-sm text-gray-300">Vishwakarma Awards: Participant, Maker Bhavan Foundation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

AboutNishant.propTypes = {
    // No props currently needed
};

export default AboutNishant;

export const displayAboutNishant = () => {
    return <AboutNishant />;
};