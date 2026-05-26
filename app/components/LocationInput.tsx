/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

type LocationItem = {
  full_address: string;
  bairname: string;
  district: string;
  horoo: string;
  lat: string;
  lon: string;
};

export default function LocationInput() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<LocationItem[]>([]);
  const [selected, setSelected] = useState("Add location");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("address");
    if (saved) setSelected(saved);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!input.trim()) return setResults([]);
    axios
      .get(
        `/api/kfcsort/searchByAddress?address=${input.replaceAll(" ", "%20")}`,
      )
      .then((res) => setResults(res.data.data));
  }, [input]);

  const handleSelect = (item: LocationItem) => {
    setSelected(item.full_address);
    localStorage.setItem("address", item.full_address);
    setInput("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="w-62.75 h-9 bg-white flex items-center rounded-lg px-2">
        <img className="w-4 h-4 mr-1 shrink-0" src="/Vector.svg" alt="Pin" />
        <p className="text-[12px] text-red-500 whitespace-nowrap shrink-0">
          Delivery address:
        </p>
        {open ? (
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="search your address"
            className="text-[12px] text-gray-500 ml-1 outline-none w-32"
          />
        ) : (
          <p
            onClick={() => setOpen(true)}
            className="text-[12px] text-gray-500 truncate ml-1 cursor-pointer"
          >
            {selected}
          </p>
        )}
        <img className="ml-1 shrink-0" src="/Chevron icon.svg" alt="Arrow" />
      </div>

      {results.length > 0 && open && (
        <div className="absolute top-10 left-0 w-80 bg-white rounded-lg shadow-xl z-50 max-h-52 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => handleSelect(r)}
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 border-b last:border-none"
            >
              <p className="font-medium">{r.bairname}</p>
              <p className="text-gray-400">{r.full_address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
