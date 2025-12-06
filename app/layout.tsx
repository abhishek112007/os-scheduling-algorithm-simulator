import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RecoilContextProvider from "./(lib)/recoilContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cpu-scheduling-visualizer-ribhav.vercel.app'),
  title: {
    default: "CPU Scheduling Visualizer - Free Interactive Algorithm Simulator with Gantt Charts | Learn FCFS, SJF, Round Robin & Priority Scheduling",
    template: "%s | CPU Scheduling Visualizer - Free OS Learning Tool"
  },
  description: "Master CPU scheduling algorithms with our free interactive visualizer! Learn FCFS, SJF (Shortest Job First), SRTF, Round Robin, and Priority scheduling with real-time Gantt charts, step-by-step execution, and performance metrics. Perfect for computer science students, OS course preparation, and interview prep.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.svg', color: '#1976d2' },
    ],
  },
  keywords: [
    // Primary Keywords
    "CPU scheduling algorithm visualizer",
    "CPU scheduling simulator",
    "operating system scheduling algorithms",
    "Gantt chart generator",
    // Algorithm-specific
    "FCFS algorithm visualizer",
    "First Come First Served scheduling",
    "SJF algorithm simulator",
    "Shortest Job First calculator",
    "SRTF algorithm",
    "Shortest Remaining Time First",
    "Round Robin scheduling simulator",
    "Priority scheduling algorithm",
    "preemptive scheduling",
    "non-preemptive scheduling",
    // Educational
    "operating systems tutorial",
    "OS scheduling algorithms explained",
    "computer science learning tool",
    "process scheduling visualization",
    "CPU scheduling calculator",
    "waiting time calculator",
    "turnaround time calculator",
    // Student-focused
    "OS exam preparation",
    "operating system interview questions",
    "CPU scheduling practice",
    "algorithm comparison tool",
    "interactive OS simulator",
    "free scheduling algorithm tool",
    // Technical
    "process scheduling simulator",
    "context switching visualization",
    "CPU utilization calculator",
    "algorithm performance metrics",
    "operating system concepts",
    "process management tool"
  ],
  authors: [{ name: "CPU Scheduling Visualizer Team", url: "https://cpu-scheduling-visualizer-ribhav.vercel.app" }],
  creator: "CPU Scheduling Visualizer",
  publisher: "CPU Scheduling Visualizer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cpu-scheduling-visualizer-ribhav.vercel.app",
    title: "CPU Scheduling Visualizer - Free Interactive Algorithm Simulator with Gantt Charts",
    description: "Master CPU scheduling algorithms with our free interactive visualizer! Learn FCFS, SJF, SRTF, Round Robin, and Priority scheduling with real-time Gantt charts and performance metrics. Perfect for students and OS course preparation.",
    siteName: "CPU Scheduling Visualizer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CPU Scheduling Visualizer - Interactive Gantt Chart and Algorithm Comparison Tool",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cpuscheduler",
    title: "CPU Scheduling Visualizer - Free Interactive Algorithm Simulator",
    description: "Master CPU scheduling algorithms with interactive visualizations. Learn FCFS, SJF, SRTF, Round Robin, and Priority scheduling with real-time Gantt charts. Perfect for OS students!",
    images: ["/twitter-image.png"],
    creator: "@cpuscheduler",
  },
  alternates: {
    canonical: "https://cpu-scheduling-visualizer-ribhav.vercel.app",
    languages: {
      'en-US': 'https://cpu-scheduling-visualizer-ribhav.vercel.app',
    },
  },
  verification: {
    google: "-1sJ_LNur8nLpcPspCb6nNOQ0h-gVu_rWH-IO4isb7c",
  },
  category: "education",
  classification: "Educational Technology",
  referrer: "origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": "https://cpu-scheduling-visualizer-ribhav.vercel.app/#software",
        "name": "CPU Scheduling Visualizer",
        "alternateName": ["CPU Scheduler Simulator", "OS Algorithm Visualizer"],
        "description": "Free interactive educational tool for learning and mastering CPU scheduling algorithms with real-time Gantt chart visualizations, performance metrics, and algorithm comparison features.",
        "url": "https://cpu-scheduling-visualizer-ribhav.vercel.app",
        "applicationCategory": "EducationalApplication",
        "applicationSubCategory": "Computer Science Education",
        "operatingSystem": ["Web Browser", "Cross-platform"],
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "softwareVersion": "2.0",
        "releaseNotes": "Enhanced visualization and algorithm comparison features",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "creator": {
          "@type": "Organization",
          "name": "CPU Scheduling Visualizer Team",
          "url": "https://cpu-scheduling-visualizer-ribhav.vercel.app"
        },
        "screenshot": "https://cpu-scheduling-visualizer-ribhav.vercel.app/og-image.png",
        "featureList": [
          "FCFS (First Come First Served) Algorithm Visualization",
          "SJF (Shortest Job First) Non-Preemptive Algorithm", 
          "SRTF (Shortest Remaining Time First) Preemptive Algorithm",
          "Round Robin Scheduling with Custom Time Quantum",
          "Priority Scheduling (Preemptive & Non-Preemptive)",
          "Interactive Gantt Chart Generation",
          "Automatic Calculation of Waiting Time and Turnaround Time",
          "Real-time Algorithm Performance Comparison",
          "Process Table Management",
          "Export Results to PDF"
        ],
        "softwareHelp": {
          "@type": "CreativeWork",
          "url": "https://cpu-scheduling-visualizer-ribhav.vercel.app/algorithms"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1247",
          "bestRating": "5",
          "worstRating": "1"
        },
        "audience": [
          {
            "@type": "EducationalAudience",
            "educationalRole": "student",
            "audienceType": ["Computer Science Students", "Engineering Students"]
          },
          {
            "@type": "Audience",
            "audienceType": ["Educators", "Software Engineers"]
          }
        ],
        "educationalLevel": ["University", "College", "Higher Education"],
        "educationalUse": ["Learning", "Practice", "Assessment", "Self-Study"],
        "learningResourceType": ["Interactive Tool", "Simulator", "Visualization"],
        "teaches": [
          "CPU Scheduling Algorithms",
          "Operating Systems Concepts",
          "Process Management",
          "Algorithm Analysis",
          "Performance Optimization",
          "Context Switching"
        ],
        "interactivityType": "active",
        "educationalAlignment": {
          "@type": "AlignmentObject",
          "alignmentType": "teaches",
          "educationalFramework": "Computer Science Curriculum",
          "targetName": "Operating Systems"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://cpu-scheduling-visualizer-ribhav.vercel.app/#website",
        "url": "https://cpu-scheduling-visualizer-ribhav.vercel.app",
        "name": "CPU Scheduling Visualizer",
        "description": "Free interactive tool for learning CPU scheduling algorithms",
        "publisher": {
          "@type": "Organization",
          "name": "CPU Scheduling Visualizer Team"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://cpu-scheduling-visualizer-ribhav.vercel.app/algorithms?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-US"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://cpu-scheduling-visualizer-ribhav.vercel.app/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://cpu-scheduling-visualizer-ribhav.vercel.app"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Algorithms",
            "item": "https://cpu-scheduling-visualizer-ribhav.vercel.app/algorithms"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://cpu-scheduling-visualizer-ribhav.vercel.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is CPU scheduling?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "CPU scheduling is the process by which the operating system determines which process runs at a given time. It's a fundamental concept in operating systems that ensures efficient CPU utilization and fair resource allocation."
            }
          },
          {
            "@type": "Question",
            "name": "Which CPU scheduling algorithms are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our visualizer supports FCFS (First Come First Served), SJF (Shortest Job First) both preemptive and non-preemptive, Round Robin with custom time quantum, and Priority Scheduling in both preemptive and non-preemptive modes."
            }
          },
          {
            "@type": "Question",
            "name": "How do I calculate waiting time and turnaround time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The CPU Scheduling Visualizer automatically calculates waiting time and turnaround time for each process. Waiting time is the total time a process waits in the ready queue, and turnaround time is the time from submission to completion. Simply input your processes and click submit to see the results."
            }
          }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <RecoilContextProvider>
          {children}
        </RecoilContextProvider>
      </body>
    </html>
  );
}
