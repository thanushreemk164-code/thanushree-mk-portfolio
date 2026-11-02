# Thanushree MK — Portfolio

A high-performance "Signal HUD" single-page developer portfolio showcasing data analytics, machine learning, and interactive data visualization projects.

Live site: https://thanushree-mk-portfolio.vercel.app

Built during the placement training program at [TAP Academy](https://thetapacademy.com/) (full-stack development, AI and augmented reality training).

## Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Animation & Motion:** GSAP (with ScrollTrigger)
- **Smooth Scroll:** Lenis
- **3D Graphics:** Three.js
- **Form Dispatch:** @emailjs/browser

## Run Locally

Clone the repository and install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment Variables

To enable direct email transmissions through the contact form, create a `.env.local` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

If these keys are omitted, the form automatically falls back to opening an encoded `mailto:` transmission in your mail client.
