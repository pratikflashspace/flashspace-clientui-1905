// src/pages/AboutUs.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Splash3dButton from "@/components/ui/3d-splash-button";
import { Button } from "@/components/ui/button";

/**
* AboutUs page that uses the same header/footer and visual style as the home page.
* Drop into src/pages/AboutUs.tsx and ensure route /about is registered in App.tsx.
*/

export default function AboutUs() {
 const navigate = useNavigate();

 useEffect(() => {
   document.title = "About — FlashSpace";
 }, []);

 return (
   <div className="min-h-screen flex flex-col bg-white text-foreground font-sans">
     <Header />

     {/* HERO — same visual style as home hero */}
     <section
       className="relative bg-cover bg-center"
       style={{
         backgroundImage:
           "linear-gradient(90deg, rgba(3,7,18,0.6) 0%, rgba(3,7,18,0.25) 60%), url('https://images.unsplash.com/photo-1523475496153-3d6cc6e0f39b?auto=format&fit=crop&w=1650&q=80')",
       }}
     >
       <div className="max-w-7xl mx-auto px-6 py-28 lg:py-32">
         <div className="max-w-3xl text-white">
           <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">About FlashSpace</h1>
           <p className="mt-4 text-lg md:text-xl text-white/90">
             We make flexible workspaces delightful — for teams, events and businesses of every size.
             Our mission is to create inspired spaces that empower people to work better.
           </p>

           <div className="mt-8 flex items-center gap-4">
             <Splash3dButton
               onClick={() => navigate("#contact")}
               className="px-6 py-3"
             >
               Get in Touch
             </Splash3dButton>

             <Button
               onClick={() => navigate("/Solutions")}
               className="px-6 py-3"
               variant="outline"
             >
               Explore Spaces
             </Button>
           </div>
         </div>

         {/* Search-like CTA bar similar to home (visual only) */}
         <div className="mt-12">
           <div className="max-w-3xl bg-white/95 rounded-lg p-4 shadow-lg flex items-center gap-3">
             <div className="flex-1">
               <div className="text-xs text-foreground/60">Location</div>
               <div className="font-semibold">Delhi</div>
             </div>
             <button
               onClick={() => navigate("/Solutions")}
               className="ml-2 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-yellow-400 text-black font-semibold shadow"
             >
               Find Spaces
             </button>
           </div>
         </div>
       </div>

       <div className="absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-white/95" />
     </section>

     {/* Page content */}
     <main className="flex-1">
       {/* Who we are / mission */}
       <section className="max-w-7xl mx-auto px-6 py-16">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
           <div>
             <h2 className="text-3xl font-bold">Who we are</h2>
             <p className="mt-4 text-foreground/80">
               FlashSpace started with a simple idea — make on-demand workspace booking fast,
               reliable and human. Today we run coworking locations, meeting rooms and virtual office
               services designed for modern teams and evolving businesses.
             </p>

             <ul className="mt-6 space-y-3">
               <li className="flex items-start gap-3">
                 <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold">1</span>
                 <div>
                   <strong className="block">Customer-first</strong>
                   <span className="text-sm text-foreground/70">We design experiences that reduce friction and increase delight.</span>
                 </div>
               </li>

               <li className="flex items-start gap-3">
                 <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold">2</span>
                 <div>
                   <strong className="block">Flexible & transparent</strong>
                   <span className="text-sm text-foreground/70">Pricing and policies that work for teams of any size and duration.</span>
                 </div>
               </li>

               <li className="flex items-start gap-3">
                 <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-400 text-black font-bold">3</span>
                 <div>
                   <strong className="block">Community-driven</strong>
                   <span className="text-sm text-foreground/70">We partner with local operators to build better workplaces for your city.</span>
                 </div>
               </li>
             </ul>
           </div>

           <div className="rounded-lg overflow-hidden shadow-lg">
             <img
               src="https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1200&q=80"
               alt="Team working"
               className="w-full h-80 object-cover"
             />
           </div>
         </div>
       </section>

       {/* Stats / Values */}
       <section className="bg-white py-12">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
           <div className="p-6 bg-yellow-50 rounded-lg shadow-sm">
             <h3 className="text-2xl font-bold">2000+</h3>
             <p className="mt-2 text-sm text-foreground/70">Bookings</p>
           </div>
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h3 className="text-2xl font-bold">4.9/5</h3>
             <p className="mt-2 text-sm text-foreground/70">Average rating</p>
           </div>
           <div className="p-6 bg-white rounded-lg shadow-sm">
             <h3 className="text-2xl font-bold">50+</h3>
             <p className="mt-2 text-sm text-foreground/70">Cities served</p>
           </div>
         </div>
       </section>

       {/* Mission & services */}
       <section className="max-w-7xl mx-auto px-6 py-16">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div>
             <h3 className="text-2xl font-bold">Our mission</h3>
             <p className="mt-3 text-foreground/80">
               To enable teams everywhere to access productive workspaces on demand — with the tools,
               support and flexibility they need to focus on what matters.
             </p>

             <h3 className="mt-8 text-2xl font-bold">Our vision</h3>
             <p className="mt-3 text-foreground/80">
               A world where work happens where teams are happiest — supported by technology and services
               that remove friction from getting work done.
             </p>
           </div>

           <div className="space-y-4">
             <div className="p-4 border rounded-lg">
               <h4 className="font-semibold">Sustainability</h4>
               <p className="text-sm text-foreground/70 mt-1">We partner with buildings and operators who meet energy-efficient and accessibility standards.</p>
             </div>
             <div className="p-4 border rounded-lg">
               <h4 className="font-semibold">Safety & Hygiene</h4>
               <p className="text-sm text-foreground/70 mt-1">Standards & checks to ensure every space meets high hygiene standards.</p>
             </div>
             <div className="p-4 border rounded-lg">
               <h4 className="font-semibold">Support</h4>
               <p className="text-sm text-foreground/70 mt-1">Reach us anytime — our support team is ready to help before, during and after your booking.</p>
             </div>
           </div>
         </div>
       </section>

       {/* Team */}
       <section className="bg-white py-12">
         <div className="max-w-7xl mx-auto px-6">
           <h3 className="text-2xl font-bold text-center">Meet the team</h3>
           <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
             {[
               { name: 'Priya K', role: 'Founder', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
               { name: 'Amit S', role: 'Head - Operations', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
               { name: 'Neha R', role: 'Product', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
               { name: 'Rohit M', role: 'Engineering', img: 'https://randomuser.me/api/portraits/men/65.jpg' },
             ].map((m) => (
               <div key={m.name} className="text-center p-4 bg-gray-50 rounded-lg shadow-sm">
                 <img src={m.img} alt={m.name} className="mx-auto w-28 h-28 rounded-full object-cover" />
                 <h4 className="mt-3 font-semibold">{m.name}</h4>
                 <p className="text-sm text-foreground/70">{m.role}</p>
               </div>
             ))}
           </div>
         </div>
       </section>

       {/* CTA Banner like home */}
       <section className="max-w-7xl mx-auto px-6 py-12">
         <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
           <div>
             <h3 className="text-xl font-bold">Ready to book a space?</h3>
             <p className="text-sm text-foreground/80 mt-1">Find a meeting room or coworking desk in minutes.</p>
           </div>
           <div className="flex items-center gap-3">
             <Splash3dButton onClick={() => navigate('/Solutions')} className="px-5 py-3">Explore Spaces</Splash3dButton>
             <Button onClick={() => navigate('#contact')} variant="outline">Talk to Sales</Button>
           </div>
         </div>
       </section>
     </main>

     <Footer />
   </div>
 );
}

