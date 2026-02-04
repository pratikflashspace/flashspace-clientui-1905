import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, ArrowLeft, Building, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import VideoBackground from "@/components/VideoBackground";

const ListYourSpace = () => {
  const [formData, setFormData] = useState({
    spaceName: "",
    spaceType: "",
    location: "",
    address: "",
    capacity: "",
    pricePerMonth: "",
    amenities: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your space listing has been submitted successfully! We'll contact you within 24 hours.");
    // Reset form
    setFormData({
      spaceName: "",
      spaceType: "",
      location: "",
      address: "",
      capacity: "",
      pricePerMonth: "",
      amenities: "",
      description: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Video Background */}
      <VideoBackground />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-black/50 to-slate-800/60 backdrop-blur-sm z-10"></div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors group">
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 relative">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              List Your <span className="gradient-text-accent">Premium Space</span>
            </h1>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-accent rounded-full animate-float opacity-60"
                  style={{
                    left: `${10 + (Math.random() * 80)}%`,
                    top: `${10 + (Math.random() * 80)}%`,
                    animationDelay: `${Math.random() * 8}s`,
                    animationDuration: `${8 + Math.random() * 6}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="bg-white/95 dark:bg-black/80 backdrop-blur-sm shadow-2xl border-white/40 dark:border-white/10 hover-lift relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-black/90 dark:to-gray-900/90 rounded-lg -z-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">Space Details</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Please provide detailed information about your space to help us create the perfect listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-0.5 bg-accent"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="spaceName" className="text-gray-700 dark:text-gray-300 font-medium">Space Name *</Label>
                      <Input
                        id="spaceName"
                        value={formData.spaceName}
                        onChange={(e) => handleInputChange("spaceName", e.target.value)}
                        placeholder="e.g., Downtown Business Center"
                        className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spaceType" className="text-gray-700 dark:text-gray-300 font-medium">Space Type *</Label>
                      <Select value={formData.spaceType} onValueChange={(value) => handleInputChange("spaceType", value)}>
                        <SelectTrigger className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white focus:border-accent focus:ring-accent/20">
                          <SelectValue placeholder="Select space type" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/10">
                          <SelectItem value="virtual-office" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Virtual Office</SelectItem>
                          <SelectItem value="coworking" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Coworking Space</SelectItem>
                          <SelectItem value="private-office" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Private Office</SelectItem>
                          <SelectItem value="meeting-room" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Meeting Room</SelectItem>
                          <SelectItem value="event-space" className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10">Event Space</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-0.5 bg-accent"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Location & Details</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 font-medium">City/Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="e.g., Mumbai, Delhi, Bangalore"
                          className="pl-10 bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity" className="text-gray-700 dark:text-gray-300 font-medium">Capacity</Label>
                      <Input
                        id="capacity"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange("capacity", e.target.value)}
                        placeholder="e.g., 50 people"
                        className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">Full Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Complete address with landmarks"
                    className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20 min-h-[80px]"
                    required
                  />
                </div>

                {/* Pricing & Amenities */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-0.5 bg-accent"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Features</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerMonth" className="text-gray-700 dark:text-gray-300 font-medium">Price per Month (₹) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">₹</span>
                      <Input
                        id="pricePerMonth"
                        type="number"
                        value={formData.pricePerMonth}
                        onChange={(e) => handleInputChange("pricePerMonth", e.target.value)}
                        placeholder="5000"
                        className="pl-8 bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities" className="text-gray-700 dark:text-gray-300 font-medium">Amenities</Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange("amenities", e.target.value)}
                      placeholder="e.g., High-speed WiFi, Parking, Cafeteria, Meeting rooms, etc."
                      className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20 min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe your space, its unique features, and what makes it special"
                      className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20 min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6 border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-0.5 bg-accent"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-gray-700 dark:text-gray-300 font-medium">Full Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => handleInputChange("contactName", e.target.value)}
                        placeholder="Your full name"
                        className="bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-gray-700 dark:text-gray-300 font-medium">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                          placeholder="your@email.com"
                          className="pl-10 bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-gray-700 dark:text-gray-300 font-medium">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="pl-10 bg-white dark:bg-black/50 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 focus:border-accent focus:ring-accent/20"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-8">
                  <Button
                    type="submit"
                    size="lg"
                    className="btn-hero px-12 py-4 text-lg font-semibold rounded-full hover-lift"
                  >
                    Submit Space Listing
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ListYourSpace;