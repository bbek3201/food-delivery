/* eslint-disable @next/next/no-img-element */

export default function Header() {
  return (
    <div className="w-full h-17 bg-black flex items-center justify-between px-50">
      <div className="flex items-center gap-2">
        <img src="/header.png" alt="Header Image" className="h-8" />
        <img src="/Text Container.svg" alt="Text" className="h-8" />
      </div>

      <div className="flex items-center gap-4">
        <div className="w-62.75 h-9 bg-white flex items-center justify-center rounded-lg px-2">
          <img className="w-4 h-4 mr-1" src="/Vector.svg" alt="Pin" />
          <p className="text-[12px] text-red-500 whitespace-nowrap">
            Delivery address:
          </p>
          <p className="text-[12px] text-gray-500 truncate ml-1">
            Add location
          </p>
          <img className="ml-1" src="/Chevron icon.svg" alt="Arrow" />
        </div>

        <img
          src="/Icon Button.svg"
          alt="Cart"
          className="w-8 h-8 cursor-pointer"
        />
        <img
          onClick={() => (window.location.href = "/sign-up")}
          src="/account.svg"
          alt="Account"
          className="w-8 h-8 cursor-pointer"
        />
      </div>
    </div>
  );
}
