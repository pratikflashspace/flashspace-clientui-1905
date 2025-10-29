import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";

const TestimonialsSection = () => {
  const isVisible = useScrollAnimation('testimonials');
  
  const companies = [
    { name: "Adda247", logo: "/Logo/Adda247.png", needsInvert: false },
    { name: "Study IQ", logo: "/Logo/StudyIQ.png", needsInvert: false },
    { name: "Flipkart", logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png", needsInvert: false },
    { name: "Truly Madly", logo: "https://cdni.trulymadly.com/tm-static-assets-production/web/logo.webp", needsInvert: false },
    { name: "Stage OTT", logo: "/Logo/Stage2.png", needsInvert: false },
    { name: "LUV Films", logo: "/Logo/luv.png", needsInvert: false },
    { name: "Callerdesk", logo: "https://callerdesk.io/img/images/caller_logo.svg", needsInvert: false },
    { name: "Konsalidon", logo: "https://www.konsalidon.com/cdn/shop/files/Logo_-_Full_Height_-_Mono_White_copy_90x@2x.png?v=1642424736", needsInvert: true },
    { name: "CareerGuide", logo: "https://www.careerguide.com/career/wp-content/uploads/2020/02/logo.png", needsInvert: false },
    { name: "Meritink", logo: "https://www.meritink.com/static/media/logo.png", needsInvert: false },
    { name: "Anarock", logo: "https://cdn.anarock.com/v2/images/anarock-logo.svg", needsInvert: false },
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  const testimonials = [
    {
      text: "FlashSpace transformed our expansion strategy. With their virtual offices across 100+ cities, we established presence in key markets without the overhead costs.",
      author: "Rajesh Kumar",
      position: "CEO, TechStart Solutions",
      company: "Mumbai"
    },
    {
      text: "The seamless mail management and professional address gave our startup the credibility we needed to secure major clients from day one.",
      author: "Priya Sharma",
      position: "Founder, Digital Innovations",
      company: "Bangalore"
    },
    {
      text: "24/7 support and lightning-fast setup helped us launch our business operations in just one day. Truly exceptional service!",
      author: "Amit Patel", 
      position: "Director, Global Ventures",
      company: "Delhi"
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-4 relative overflow-hidden bg-[#ffffff]">

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${getAnimationClasses(isVisible, 'fadeInUp', 0)}`} style={{ fontFamily: 'Poppins' }}>
            <span className="text-[#172A3A]">Trusted by Industry Leaders</span>
            <br />
            <span className="text-[#EDB003] text-2xl md:text-3xl">Across India</span>
          </h2>
          <p className={`text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed font-content ${getAnimationClasses(isVisible, 'fadeInUp', 200)}`}>
            Join thousands of successful businesses who chose FlashSpace to accelerate their growth
            and establish their market presence with confidence.
          </p>
        </div>

        {/* Company Logos Carousel */}
        <div className={`mb-12 overflow-hidden ${getAnimationClasses(isVisible, 'fadeIn', 300)}`}>
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

            {/* Scrolling Logos */}
            <div className="infinite-scroll">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 mx-4 flex items-center justify-center w-52 h-32"
                >
                  <div className={`${company.needsInvert ? 'bg-[#172A3A]' : 'bg-white'} border-2 border-gray-200 p-6 w-full h-full flex items-center justify-center hover:shadow-xl transition-all duration-300 rounded-xl group hover:border-[#EDB003] relative overflow-hidden`}>
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-sm font-bold ${company.needsInvert ? 'text-white' : 'text-[#172A3A]'} group-hover:text-[#EDB003] tracking-wider transition-colors duration-300 text-center">${company.name}</span>`;
                        }
                      }}
                    />
                    {/* Subtle corner accent */}
                    <div className="absolute top-0 right-0 w-3 h-3 bg-[#EDB003]/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Testimonials */}
        <div className="text-center mb-8 mt-16">
          <h3 className={`text-3xl md:text-4xl font-bold mb-4 text-[#172A3A] ${getAnimationClasses(isVisible, 'fadeInUp', 400)}`} style={{ fontFamily: 'Poppins' }}>
            Great People <span className="text-[#EDB003]">Trust Us</span>
          </h3>
          <p className={`text-gray-600 font-content ${getAnimationClasses(isVisible, 'fadeInUp', 500)}`}>
            Real stories from real businesses who transformed their operations with FlashSpace
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-white shadow-md hover:shadow-xl hover:scale-105 border-2 border-gray-200 hover:border-[#EDB003] transition-all duration-500 ${getAnimationClasses(isVisible, 'fadeInUp', 600 + index * 100)}`}
            >
              <CardContent className="p-6">
                {/* Quote */}
                <div className="text-6xl text-[#EDB003]/20 mb-4 font-serif">"</div>
                <p className="text-gray-600 leading-relaxed mb-4 font-content">
                  {testimonial.text}
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#172A3A]/15 to-[#EDB003]/15 rounded-full flex items-center justify-center">
                      <span className="text-[#172A3A] font-bold text-lg">
                        {testimonial.author.split(' ').map(name => name[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-[#172A3A] font-content">{testimonial.author}</div>
                      <div className="text-sm text-gray-600 font-content">{testimonial.position}</div>
                      <div className="text-sm text-[#EDB003] font-content">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className={`bg-white border-2 border-gray-200 shadow-lg  ${getAnimationClasses(isVisible, 'fadeInUp', 900)}`}>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins' }}>5000+</div>
                <div className="text-gray-600 font-content text-sm">Happy Clients</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins' }}>100+</div>
                <div className="text-gray-600 font-content text-sm">Cities Covered</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins' }}>10K+</div>
                <div className="text-gray-600 font-content text-sm">Registrations Done</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins' }}>98%</div>
                <div className="text-gray-600 font-content text-sm">Satisfaction Rate</div>
              </div>
              <div className="group">
                <div className="text-3xl md:text-4xl font-bold text-[#EDB003] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: 'Poppins' }}>&lt;3days</div>
                <div className="text-gray-600 font-content text-sm">Avg Delivery Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TestimonialsSection;