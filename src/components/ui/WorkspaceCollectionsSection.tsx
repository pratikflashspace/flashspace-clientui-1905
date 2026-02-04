
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Monitor, Users, Building2, ArrowRight, Presentation } from "lucide-react";

const WorkspaceCollectionsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    const section = document.getElementById("workspace-collections");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const collections = [
    {
      icon: Monitor,
      title: "Virtual Offices",
      description: "Professional business address with mail handling and call forwarding. Perfect for remote teams and startups.",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop"
      ],
      bgColor: "bg-blue-50",
      accentColor: "bg-blue-600"
    },
    {
      icon: Users,
      title: "Coworking Spaces",
      description: "Flexible hot desks and dedicated seats in vibrant communities. Network, collaborate and grow together.",
      images: [
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=300&fit=crop"
      ],
      bgColor: "bg-purple-50",
      accentColor: "bg-purple-600"
    },
    {
      icon: Presentation,
      title: "Meeting Rooms",
      description: "On-demand meeting rooms and conference halls equipped with premium AV and video conferencing tools.",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517502884422-41e157d2ed22?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop"
      ],
      bgColor: "bg-amber-50",
      accentColor: "bg-amber-600"
    }
  ];

  return (
    <section id="workspace-collections" className="py-20 px-4 relative overflow-hidden bg-white">
      <div className="container mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Workspace Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find your perfect workspace. Save your favorites and plan your ideal work setup.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => {
            const IconComponent = collection.icon;
            return (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden cursor-pointer
                  ${collection.bgColor} border-0 rounded-3xl
                  transition-all duration-500
                  hover:shadow-2xl hover:-translate-y-3
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
                  ${activeCard === index ? 'shadow-2xl -translate-y-3 scale-105' : 'shadow-lg'}
                `}
                style={{
                  transitionDelay: `${index * 150}ms`,
                  minHeight: '550px'
                }}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Image Collage */}
                <div className="relative h-64 overflow-hidden">
                  {/* Main large image */}
                  <div className="absolute top-4 left-4 right-20 h-40 rounded-2xl overflow-hidden shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <img
                      src={collection.images[0]}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Small top right image */}
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-xl overflow-hidden shadow-lg transform rotate-6 group-hover:rotate-3 transition-transform duration-500">
                    <img
                      src={collection.images[1]}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Small bottom right image */}
                  <div className="absolute top-32 right-4 w-28 h-28 rounded-xl overflow-hidden shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform duration-500">
                    <img
                      src={collection.images[2]}
                      alt={collection.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Binoculars icon overlay */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Icon badge */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${collection.accentColor} rounded-xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {collection.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 leading-relaxed mb-6 text-base">
                    {collection.description}
                  </p>

                  {/* CTA Button */}
                  <button className={`
                    inline-flex items-center gap-2 px-6 py-3 
                    ${collection.accentColor} text-white font-semibold rounded-xl
                    hover:shadow-lg transition-all duration-300
                    group-hover:gap-4
                  `}>
                    Try it Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom text */}
        <div className="text-center mt-16">
          <p className="text-gray-600 text-lg">
            See a space you love? <span className="font-bold text-gray-900">Save it to a collection</span> — your favorites sorted by <br />
            location, amenities or team size. Start planning your perfect workspace today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceCollectionsSection;