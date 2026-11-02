// ============================================================
// portfolioData.js — ALL content for the portfolio lives here.
// Components only read from this file.
// ============================================================

export const personalInfo = {
  name: "Thanushree MK",
  brandName: "Thanushree MK",
  role: "Data Analyst",
  city: "Bengaluru, India",
  timezone: "Asia/Kolkata", // IANA timezone used by the live clock in the HUD
  email: "thanushreemk164@gmail.com",
  phone: "+91 9036861352",
  availability: "Open to Internships and Full Time Jobs",
};

export const academy = {
  name: "TAP Academy",
  url: "https://thetapacademy.com/",
};

export const socialLinks = {
  github: "https://github.com/thanushreemk164-code",
  linkedin: "https://www.linkedin.com/in/thanushree-mk-3882183ab",
  instagram: "",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export const heroContent = {
  eyebrow: "PORTFOLIO — 2026",
  intro: "Aspiring Data Analyst passionate about transforming raw data into meaningful insights through analysis and visualization.",
  statusLines: ["Learning Data Analytics", "Working with Python & SQL", "Exploring Data Visualization"],
  ctaPrimary: { label: "View projects", href: "#projects" },
  ctaSecondary: { label: "Get in touch", href: "#contact" },
};

export const aboutContent = {
  label: "01 / About",
  heading: "Transforming raw data into meaningful insights.",
  paragraph:
    "I am an Information Science and Engineering graduate with a strong interest in Data Analytics. I have foundational knowledge of Python, SQL, Pandas, NumPy, Statistics, Seaborn, Matplotlib, Power BI and Tableau. I enjoy analysing data, identifying patterns and creating meaningful visualizations. Currently, I am sharpening my skills through the placement training program at TAP Academy and am eager to apply my skills to grow as a Data Analyst.",
  stats: [
    { value: 8, suffix: "+", label: "Data Analysis Skills" },
    { value: 3, suffix: "+", label: "Data Visualization Tools" },
    { value: 2, suffix: "+", label: "Practical Projects" },
  ],
};

export const skillGroups = [
  { title: "Programming", items: ["Python", "SQL"] },
  { title: "Python Libraries", items: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"] },
  { title: "Statistics", items: ["Descriptive Statistics", "Probability", "Statistical Analysis"] },
  { title: "Data Visualization & BI", items: ["Microsoft Excel", "Power BI", "Tableau"] },
];

export const projects = [
  {
    id: "project-1",
    number: "01",
    title: "Early Prediction of Spinal Muscular Atrophy",
    description: "Analysed clinical data and developed a machine learning prediction model using Random Forest and KNN.",
    tags: ["Python", "Scikit-learn", "Machine Learning"],
    year: "2026",
    liveUrl: "https://github.com/thanushreemk164-code/SMA-Early-Prediction-ML.git",
    githubUrl: "https://github.com/thanushreemk164-code/SMA-Early-Prediction-ML.git",
  },
  {
    id: "project-2",
    number: "02",
    title: "Mane-Kelsa – Community Services App",
    description: "Developed an Android application to connect residents with domestic workers and gardeners.",
    tags: ["Kotlin", "Firebase", "Android Studio"],
    year: "2026",
    liveUrl: "https://github.com/thanushreemk164-code/Mane-Kelsa.git",
    githubUrl: "https://github.com/thanushreemk164-code/Mane-Kelsa.git",
  },
];

export const experience = [
  {
    period: "2026 — Present",
    role: "Data Analytics Intern",
    org: "TAP Academy",
    description: "Learning Python, SQL, Statistics, and Data Visualization tools.",
  },
  {
    period: "2025 — 2026",
    role: "Android App Development Intern",
    org: "MindMatrix",
    description: "Developed the Mane-Kelsa application using Kotlin and Firebase.",
  },
  {
    period: "2022 — 2026",
    role: "B.E. Information Science and Engineering",
    org: "Bangalore College of Engineering and Technology, Bengaluru",
    description: "Completed undergraduate studies and academic projects.",
  },
];

export const contactContent = {
  label: "04 / Contact",
  heading: "Let's connect and work with data.",
  note: "Have an internship, job opportunity, or project? Send a message — I reply promptly.",
};

export const footerContent = {
  tagline: "Designed & built by hand.",
};

// EmailJS — values come from .env.local (variables must start with VITE_)
export const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_EMAILJS_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_EMAILJS_TEMPLATE_ID",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY",
};
