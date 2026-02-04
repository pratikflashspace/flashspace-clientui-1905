import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Services = () => {
  const services = [
    {
      title: "VIRTUAL OFFICE",
      description: "Professional business address with mail handling, call forwarding, and meeting room access when needed."
    },
    {
      title: "COWORKING SPACE",
      description: "Flexible shared workspace with high-speed internet, modern amenities, and networking opportunities."
    },
    {
      title: "ON DEMAND",
      description: "Book meeting rooms, conference facilities, and workspace on hourly or daily basis as per your requirements."
    },
    {
      title: "EVENT SPACES",
      description: "Premium venues for corporate events, seminars, workshops, and business gatherings of all sizes."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
      <Header forceWhiteBackground />
      <main className="pt-20 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Complete Business Ecosystem at Your Fingertips
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-7xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative h-80 border-2 border-gray-200 dark:border-white/30 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-gray-400 dark:hover:border-white/60 hover:shadow-lg dark:hover:shadow-white/10"
              >
                {/* Default State */}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-hover:opacity-0 bg-gray-50 dark:bg-transparent">
                  <h3 className="text-gray-900 dark:text-white text-lg font-bold tracking-wider text-center px-4">
                    {service.title}
                  </h3>
                </div>

                {/* Hover State */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-white/95 dark:bg-black/80 p-6 backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-gray-900 dark:text-white text-xl font-bold mb-4 tracking-wider">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-white/90 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;