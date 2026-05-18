/* eslint-disable @next/next/no-img-element */
import { FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white w-full">

      <div className="bg-[#E74C3C] py-6 overflow-hidden whitespace-nowrap">
  <div
    className="flex gap-10 w-max"
    style={{
      animation: "marquee 12s linear infinite",
    }}
  >
    {[...Array(16)].map((_, i) => (
      <span key={i} className="text-3xl font-bold uppercase italic text-white">
        Fresh fast delivered 
      </span>
    ))}
  </div>

  <style>{`
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
</div>


      <div className="max-w-7xl mx-auto px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-col">
            
               <img src="header.png" alt="NomNom" />
              <img src="Text Container.svg" alt="" />
             
            </div>
          </div>


          <div className="space-y-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-sm">Nomnom</h3>
            <ul className="space-y-3 text-lg">
              <li><a href="#" className="hover:text-[#E74C3C]">Home</a></li>
              <li><a href="#" className="hover:text-[#E74C3C]">Contact us</a></li>
              <li><a href="#" className="hover:text-[#E74C3C]">Delivery zone</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-sm">Menu</h3>
            <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-lg">
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-[#E74C3C]">Appetizers</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Salads</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Pizzas</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Main dishes</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Desserts</a></li>
              </ul>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-[#E74C3C]">Side dish</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Brunch</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Desserts</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Beverages</a></li>
                <li><a href="#" className="hover:text-[#E74C3C]">Fish & Sea foods</a></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-500 font-bold uppercase tracking-widest text-sm">Follow us</h3>
            <div className="flex gap-4">
              <FaFacebook className="w-8 h-8 cursor-pointer hover:text-[#E74C3C]" />
              <FaInstagram className="w-8 h-8 cursor-pointer hover:text-[#E74C3C]" />
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between text-gray-500 text-sm gap-4">
          <p>Copy right 2024 © Nomnom LLC</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy policy</a>
            <a href="#" className="hover:text-white">Terms and condition</a>
            <a href="#" className="hover:text-white">Cookie policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}