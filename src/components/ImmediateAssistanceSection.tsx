import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import {
  useScrollAnimation,
  getAnimationClasses,
} from "@/hooks/use-scroll-animation";

const ImmediateAssistanceSection = () => {
  const isVisible = useScrollAnimation("immediate-assistance");

  return (
    <section
      id="immediate-assistance"
      className="py-8 sm:py-12 px-4 bg-transparent dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <Card
            {...getAnimationClasses(isVisible, "scale", 0)}
            className={`relative overflow-hidden border-2 border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-500 ${getAnimationClasses(isVisible, "scale", 0).className}`}
            style={getAnimationClasses(isVisible, "scale", 0).style}
          >
            {/* Light Background Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000"
                alt="Office Background"
                className="w-full h-full object-cover brightness-110"
              />
              {/* Light Yellow Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/95 via-yellow-100/90 to-yellow-200/95 dark:from-yellow-900/40 dark:via-black/80 dark:to-black/90"></div>
            </div>

            <CardContent className="relative p-6 sm:p-8 md:p-12 text-center">
              <h3
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
                style={{ fontFamily: "poppins" }}
              >
                Need Immediate{" "}
                <span className="text-yellow-600 dark:text-yellow-400">
                  Assistance?
                </span>
              </h3>
              <p className="text-gray-700 dark:text-gray-200 mb-6 sm:mb-8 text-base sm:text-lg md:text-xl font-medium">
                Our support team is available 24/7 to help you get started
              </p>
              <Button className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">
                  Call +91 8100888777
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ImmediateAssistanceSection;
