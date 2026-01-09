import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation, getAnimationClasses } from "@/hooks/use-scroll-animation";

const ContactSection = () => {
  const { toast } = useToast();
  const isVisible = useScrollAnimation('contact');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      content: "+91 8100888777",
      action: "Call Now",
      href: "tel:+918100888777",
      bgColor: "from-yellow-50/95 via-amber-50/90 to-yellow-100/95"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      content: "support@flashspace.co",
      action: "Send Email",
      href: "mailto:support@flashspace.co",
      bgColor: "from-yellow-100/95 via-white/90 to-amber-100/95"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Locations",
      content: "100+ Cities Across India",
      action: "Find Locations",
      href: "#locations",
      bgColor: "from-amber-50/95 via-yellow-50/90 to-yellow-100/95"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      content: "24/7 Support Available",
      action: "Get Support",
      href: "#support",
      bgColor: "from-yellow-50/95 via-amber-100/90 to-yellow-200/95"
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 relative overflow-hidden bg-[#ffffff] dark:bg-[#0a0a0a] transition-colors duration-300">

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${getAnimationClasses(isVisible, 'fadeInUp', 0)}`} style={{ fontFamily: 'Poppins' }}>
            <span className="text-[#172A3A] dark:text-white">Ready to Transform Your Business?</span>
            <br />
            <span className="text-[#EDB003]">Let's Connect!</span>
          </h2>
          <p className={`text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed ${getAnimationClasses(isVisible, 'fadeInUp', 200)}`}>
            Get started with FlashSpace today and experience the future of virtual office solutions.
            Our team is ready to help you find the perfect solution for your business needs.
          </p>
        </div>

        {/* Contact Form and Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Contact Form */}
          <div className="w-full">
            <Card className={`bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:border-[#EDB003] dark:hover:border-[#EDB003] ${getAnimationClasses(isVisible, 'slideRight', 400)}`}>
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-[#172A3A] dark:text-white flex items-center gap-3" style={{ fontFamily: 'instrument-serif' }}>
                  <Send className="w-8 h-8 text-[#EDB003]" />
                  Get in Touch
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-400">Fill out the form and we'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="dark:text-white">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                        className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-white">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Phone and Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="dark:text-white">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="dark:text-white">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Your Company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white dark:placeholder:text-gray-500"
                      />
                    </div>
                  </div>

                  {/* Service Interest */}
                  <div className="space-y-2">
                    <Label htmlFor="service" className="dark:text-white">Service Interest</Label>
                    <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                      <SelectTrigger className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-[#1f1f1f] border-2 border-gray-200 dark:border-white/10 shadow-lg dark:text-white">
                        <SelectItem value="virtual-office">Virtual Office Solutions</SelectItem>
                        <SelectItem value="business-registration">Business Registration</SelectItem>
                        <SelectItem value="mail-management">Mail Management</SelectItem>
                        <SelectItem value="meeting-rooms">Meeting Room Access</SelectItem>
                        <SelectItem value="coworking">Coworking Space</SelectItem>
                        <SelectItem value="consultation">Free Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="dark:text-white">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your business needs..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      rows={4}
                      className="bg-gray-50 dark:bg-black/30 border-2 border-gray-200 dark:border-white/10 focus:border-[#EDB003] dark:focus:border-[#EDB003] dark:text-white dark:placeholder:text-gray-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#EDB003] hover:bg-[#172A3A] text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Dynamic Image Section */}
          <div className={`w-full h-full flex items-center justify-center ${getAnimationClasses(isVisible, 'slideLeft', 400)}`}>
            <div className="relative w-full h-[500px] sm:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              {/* Luxury Office Background Image */}
              <img
                src="https://res.cloudinary.com/diwna43hl/image/upload/v1759730561/WhatsApp_Image_2025-10-05_at_23.54.17_9efa553a_n7grvz.jpg"
                alt="Luxury Office Space"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Cards - Moved Below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden border-2 border-gray-200 dark:border-white/10 hover:border-[#EDB003] dark:hover:border-[#EDB003] transition-all duration-300 cursor-pointer group shadow-sm hover:shadow-lg bg-white dark:bg-[#1f1f1f] ${getAnimationClasses(isVisible, 'fadeInUp', 800 + index * 100)}`}
              onClick={() => window.open(info.href, '_blank')}
            >
              {/* Transparent Gradient Overlay Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${info.bgColor} dark:opacity-10`}></div>

              <CardContent className="relative p-6 sm:p-8 text-center min-h-[280px] flex flex-col justify-between">
                {/* Icon Container */}
                <div className="w-16 h-16 mx-auto mb-6 bg-[#EDB003] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                  <div className="text-white">
                    {info.icon}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#172A3A] dark:text-white mb-3 text-lg sm:text-xl">{info.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium text-sm sm:text-base">{info.content}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-gray-200 bg-white text-[#172A3A] hover:bg-[#EDB003] hover:text-white hover:border-[#EDB003] transition-all duration-300 font-semibold"
                >
                  {info.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;