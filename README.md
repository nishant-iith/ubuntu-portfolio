# 🖥️ Ubuntu Portfolio - Interactive Portfolio Website

An interactive Ubuntu 18.04 themed portfolio website built with Next.js, featuring a fully functional terminal, draggable windows, and real-time coding statistics.

![Ubuntu Portfolio](https://img.shields.io/badge/Next.js-14.2.32-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.2.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **🖼️ Ubuntu 18.04 Desktop Interface** - Authentic Ubuntu desktop experience in your browser
- **💻 Interactive Terminal** - Fully functional bash-like terminal with command history and autocomplete
- **📱 Draggable Windows** - Minimize, maximize, and close windows just like a real OS
- **📊 Live Coding Stats Widget** - Real-time statistics from CodeForces, LeetCode, and GitHub
- **🧮 Calculator App** - Scientific calculator with keyboard support
- **⚙️ Settings Panel** - Customize wallpapers and preferences
- **📧 Contact Form** - Get in touch via EmailJS integration
- **🎨 Responsive Design** - Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.x
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishant-iith/ubuntu-portfolio.git
   cd ubuntu-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` and add your API keys:
   - Google Analytics Tracking ID (optional)
   - EmailJS credentials (for contact form)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Building for Production

### Standard Next.js Build

```bash
npm run build
npm start
```

### GitHub Pages Deployment

```bash
# Set GITHUB_PAGES=true in your environment
export GITHUB_PAGES=true

# Build and export static files
npm run export
```

The static files will be generated in the `docs/` directory, ready for GitHub Pages deployment.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **UI Library:** [React 18](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Analytics:** [React GA4](https://github.com/react-ga/react-ga)
- **Email:** [EmailJS](https://www.emailjs.com/)
- **Drag & Drop:** [react-draggable](https://github.com/react-grid-layout/react-draggable)
- **Deployment:** [GitHub Pages](https://pages.github.com/) / [Vercel](https://vercel.com/)

## 📂 Project Structure

```
ubuntu-portfolio/
├── components/           # React components
│   ├── apps/            # Application components (Terminal, Calc, etc.)
│   ├── base/            # Base UI components (Window, Dock)
│   ├── context menus/   # Right-click context menus
│   ├── screen/          # Screen components (Desktop, Navbar)
│   ├── util components/ # Utility components
│   ├── widgets/         # CodeStats and other widgets
│   └── SEO/             # SEO meta components
├── pages/               # Next.js pages
├── public/              # Static assets (images, icons, wallpapers)
├── styles/              # Global styles
├── apps.config.js       # Application configuration
└── next.config.js       # Next.js configuration
```

## 🎮 Terminal Commands

The interactive terminal supports various commands:

**Navigation:**
- `cd [directory]` - Change directory
- `ls [directory]` - List directory contents
- `pwd` - Print working directory
- `clear` - Clear terminal screen
- `exit` - Close terminal

**File Operations:**
- `cat [file]` - Display file contents
- `mkdir [name]` - Create new folder
- `echo [text]` - Print text

**Applications:**
- `about-nishant` - Open About section
- `settings` - Open Settings panel
- `sendmsg` - Open Contact form

**System:**
- `help` - Show available commands
- `whoami` - Display current user
- `date` - Show current date/time
- `uptime` - Show system uptime

**Fun:**
- `sudo` - Try it and see! 😉
- `cowsay [text]` - ASCII cow says your text

## 🎨 Customization

### Changing Personal Information

Edit the content in:
- `components/apps/nishant.js` - About, Education, Skills, Experience, Projects, Contact
- `components/SEO/Meta.js` - SEO metadata

### Adding New Apps

1. Create component in `components/apps/`
2. Add app configuration to `apps.config.js`
3. Import and add to apps array

### Changing Wallpapers

Add wallpaper images to `public/images/wallpapers/` and update the validation arrays in:
- `components/ubuntu.js`
- `components/apps/settings.js`

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nishant-iith/ubuntu-portfolio/issues).

## 📧 Contact

**Nishant**
- GitHub: [@nishant-iith](https://github.com/nishant-iith)
- LinkedIn: [nishant-iith](https://www.linkedin.com/in/nishant-iith/)
- Email: iith.nishant@gmail.com

## 🙏 Acknowledgments

- Inspired by Ubuntu 18.04 LTS
- Icons from [Yaru Icon Theme](https://github.com/ubuntu/yaru)
- Wallpapers from various Ubuntu community sources

---

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Nishant](https://github.com/nishant-iith)
