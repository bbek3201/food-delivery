export default function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out forwards;
        }
      `}</style>

      <div className="relative w-full h-[700px] overflow-hidden  ">
        <img
          src="BG.png"
          alt="hero"
          className="w-full h-full bg-cover animate-fadeIn bg-center bg-no-repeat       "
        />
      </div>
    </>
  );
}
