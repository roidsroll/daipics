import Image from 'next/image';
import Navbar from './components/Navbar';
import ImageCard from './components/ImageCard';
import { Button } from '@/components/ui/button'; // Import Shadcn Button

export default function Home() {
  const portfolioItems = [
    {
      id: 1,
      src: "/image/image-1.webp", // Actual image path
      alt: "Thoughtful Gaze Line Art",
      path: "/image/image-1.webp",
      title: "Ephemeral Glimpse",
      description: "A vibrant abstract piece using mixed media techniques, exploring dynamic forms and colors.",
      hashtags: ["lineart", "portrait", "illustration", "digitalart"],
      philosophy: "Capturing the fleeting nature of perception, where reality is a momentary interplay of shadow and light, seen through the aperture of the soul.",
      date: "Feb 28, 2026"
    },
    {
      id: 2,
      src: "/image/image-2.webp", // Actual image path
      alt: "Cool Pose Line Art",
      path: "/image/image-2.webp",
      title: "Rebel's Muse",
      description: "Detailed digital painting of a mystical forest, focusing on light and shadow.",
      hashtags: ["lineart", "character", "sketch", "maleportrait"],
      philosophy: "An ode to the quiet defiance within, a rebellion not of chaos, but of self-expression, echoing the untamed spirit of creativity.",
      date: "Mar 10, 2026"
    },
    {
      id: 3,
      src: "/image/image-3.webp", // Actual image path
      alt: "Relaxed Portrait Line Art",
      path: "/image/image-3.webp",
      title: "Tranquil Contemplation",
      description: "A clean and modern vector icon set designed for a tech startup's new application.",
      hashtags: ["lineart", "minimalist", "femaleportrait", "ndaaiii"],
      philosophy: "In the stillness, an unfolding universe. A gentle reminder that the deepest truths are often found in the quietest moments of reflection.",
      date: "Apr 05, 2026"
    },
    {
      id: 4,
      src: "/image/image-4.webp", // Actual image path
      alt: "Selfie Pose Line Art",
      path: "/image/image-4.webp",
      title: "Digital Echoes",
      description: "A traditional pencil sketch capturing the serene beauty of a mountain landscape.",
      hashtags: ["lineart", "selfie", "illustration", "youth"],
      philosophy: "The modern reflection, a captured fragment of presence echoing through digital space, inviting us to ponder self and connection in a networked world.",
      date: "May 15, 2026"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="container mx-auto py-8 px-4 flex-grow">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center my-16 p-8 md:p-12 lg:p-16 rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 animate-fade-in-down" style={{ '--animation-delay': '0.2s' } as React.CSSProperties}>
          {/* Background Frame Image */}
          <Image
            src="/image/frame-border.webp"
            alt="Artistic Frame"
            layout="fill"
            objectFit="cover" // Frame should cover the hero section
            className="absolute inset-0 z-0 opacity-20 animate-pulse" // Subtle animation and transparency
          />
          <div className="relative z-10 text-center max-w-4xl mx-auto"> {/* Content on top of frame */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 font-pacifico drop-shadow-lg">
              daipics: Where Creativity Meets Canvas
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-poppins drop-shadow-md">
              Showcasing a diverse collection of captivating artwork, from intricate illustrations to stunning graphic designs. Explore the world through my unique artistic vision.
            </p>
            <Button size="lg" className="px-8 py-3 text-lg font-semibold font-poppins shadow-lg">
              View My Portfolio
            </Button>
          </div>
        </section>

        {/* Portfolio Grid */}
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">My Products</h2>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
          {portfolioItems.map((item, index) => (
            <div key={item.id} style={{ '--animation-delay': `${index * 0.1}s` } as React.CSSProperties}>
              <ImageCard
                src={item.src}
                alt={item.alt}
                path={item.path}
                title={item.title}
                description={item.description}
                hashtags={item.hashtags}
                philosophy={item.philosophy}
                date={item.date}
                itemId={item.id} // Pass itemId here
              />
            </div>
          ))}
        </section>
      </main>

    </div>
  );
}