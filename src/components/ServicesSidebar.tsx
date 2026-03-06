import { useState } from "react";
import { Building, Briefcase, Users, MapPin, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";

const ServicesSidebar = () => {
  const location = useLocation();

  const services = [
    {
      icon: <Building className="w-5 h-5" />,
      title: "Virtual Office",
      path: "/services/virtual-office",
      description: "Professional business address solutions",
    },
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Coworking Space",
      path: "/services/coworking-space",
      description: "Flexible workspace solutions",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "On Demand",
      path: "/services/on-demand",
      description: "Meeting rooms & services",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Event Spaces",
      path: "/services/event-spaces",
      description: "Premium event venues",
    },
  ];

  return (
    <div className="hidden lg:block w-80 bg-white/95 backdrop-blur-sm border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Business Solutions
        </h2>
        <p className="text-gray-600 text-sm">
          Complete ecosystem for your business needs
        </p>
      </div>

      <div className="space-y-3">
        {services.map((service, index) => {
          const isActive = location.pathname === service.path;

          return (
            <Link key={index} to={service.path} className="block">
              <Card
                className={`
                p-4 cursor-pointer transition-all duration-300 border hover:shadow-md
                ${
                  isActive
                    ? "bg-accent/20 border-accent/30 shadow-md"
                    : "bg-white/50 border-gray-200 hover:bg-gray-50/80"
                }
              `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      p-2 rounded-lg transition-colors duration-300
                      ${
                        isActive
                          ? "bg-accent/30 text-accent"
                          : "bg-gray-100 text-gray-600"
                      }
                    `}
                    >
                      {service.icon}
                    </div>
                    <div>
                      <h3
                        className={`
                        font-semibold transition-colors duration-300
                        ${isActive ? "text-accent" : "text-gray-900"}
                      `}
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`
                    w-4 h-4 transition-all duration-300
                    ${
                      isActive
                        ? "text-accent translate-x-1"
                        : "text-gray-400 group-hover:translate-x-1"
                    }
                  `}
                  />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Contact CTA */}
      <div className="mt-8 p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-3">
          Get personalized recommendations for your business needs.
        </p>
        <Link
          to="/contact"
          className="block w-full text-center bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-300"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default ServicesSidebar;
