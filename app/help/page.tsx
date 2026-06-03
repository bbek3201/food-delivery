"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HelpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-аас аль хэсэг нээгдэхийг уншина (жишээ нь: /help?tab=delivery)
  const tab = searchParams.get("tab") || "delivery";
  const [activeTab, setActiveTab] = useState(tab);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    router.push(`/help?tab=${tabName}`);
  };

  return (
    <main className="bg-[#FDF9F3] min-h-screen">
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <button
          onClick={() => router.push("/")}
          className="bg-[#634832] text-white py-2 px-6 rounded-xl font-bold hover:bg-[#4E3928] transition-all shadow-md mb-8 text-sm"
        >
          ← Нүүр хуудас руу буцах
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          {/* ЗҮҮН ТАЛЫН ЦЭС (МЕНЮ) */}
          <div className="w-full md:w-1/4 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-fit space-y-2">
            <button
              onClick={() => handleTabChange("delivery")}
              className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "delivery"
                  ? "bg-[#634832] text-white shadow-md"
                  : "text-[#2A1C0F] hover:bg-gray-50"
              }`}
            >
              🚚 Хүргэлт, төлбөр
            </button>
            <button
              onClick={() => handleTabChange("faq")}
              className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "faq"
                  ? "bg-[#634832] text-white shadow-md"
                  : "text-[#2A1C0F] hover:bg-gray-50"
              }`}
            >
              ❓ Түгээмэл асуулт
            </button>
            <button
              onClick={() => handleTabChange("privacy")}
              className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "privacy"
                  ? "bg-[#634832] text-white shadow-md"
                  : "text-[#2A1C0F] hover:bg-gray-50"
              }`}
            >
              🛡️ Нууцлалын бодлого
            </button>
            <button
              onClick={() => handleTabChange("terms")}
              className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === "terms"
                  ? "bg-[#634832] text-white shadow-md"
                  : "text-[#2A1C0F] hover:bg-gray-50"
              }`}
            >
              📜 Үйлчилгээний нөхцөл
            </button>
          </div>

          {/* БАРУУН ТАЛЫН МЭДЭЭЛЭЛ ХАРАГДАХ ХЭСЭГ */}
          <div className="w-full md:w-3/4 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
            {/* ХҮРГЭЛТ, ТӨЛБӨР */}
            {activeTab === "delivery" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-2xl font-black text-[#2A1C0F] uppercase">
                  Хүргэлт, төлбөрийн нөхцөл
                </h2>
                <hr className="border-gray-100" />
                <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                  <p>
                    <strong className="text-[#8B5E34]">
                      1. Хүргэлтийн хугацаа:
                    </strong>{" "}
                    Захиалга баталгаажсанаас хойш 30-50 минутын дотор
                    халуунаараа шуурхай хүргэгдэнэ.
                  </p>
                  <p>
                    <strong className="text-[#8B5E34]">
                      2. Хүргэлтийн төлбөр:
                    </strong>{" "}
                    Суурь төлбөр 5,000₮. Хэрэв 50,000₮-өөс дээш үнийн дүнтэй
                    захиалга хийвэл хүргэлт үнэгүй.
                  </p>
                  <p>
                    <strong className="text-[#8B5E34]">
                      3. Төлбөрийн хэлбэр:
                    </strong>{" "}
                    Бүх банкны аппликейшн (QR код), Дансаар шилжүүлэх болон Карт
                    уншуулах боломжтой.
                  </p>
                </div>
              </div>
            )}

            {/* ТҮГЭЭМЭЛ АСУУЛТ (FAQ) */}
            {activeTab === "faq" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-2xl font-black text-[#2A1C0F] uppercase">
                  Түгээмэл асуулт хариулт
                </h2>
                <hr className="border-gray-100" />
                <div className="space-y-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <h4 className="font-bold text-[#2A1C0F] mb-1">
                      Q: Захиалга цуцалж болох уу?
                    </h4>
                    <p className="text-gray-500">
                      A: Захиалга өгснөөс хойш 5 минутын дотор 7000-1234 дугаарт
                      залгаж цуцалж болно.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <h4 className="font-bold text-[#2A1C0F] mb-1">
                      Q: Ажлын цагийн хуваарь ямар вэ?
                    </h4>
                    <p className="text-gray-500">
                      A: Өдөр бүр 10:00 - 22:00 цагийн хооронд ажиллана. Сүүлийн
                      захиалга 21:30-д хаагдана.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* НУУЦЛАЛЫН БОДЛОГО */}
            {activeTab === "privacy" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-2xl font-black text-[#2A1C0F] uppercase">
                  Нууцлалын бодлого
                </h2>
                <hr className="border-gray-100" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  Манай систем таны оруулсан нэр, утасны дугаар, хүргэлтийн
                  хаягийг зөвхөн захиалга хүргэх зорилгоор ашиглах бөгөөд
                  гуравдагч этгээдэд худалдахгүй, дамжуулахгүй байх нууцлалыг
                  бүрэн хангана.
                </p>
              </div>
            )}

            {/* ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ */}
            {activeTab === "terms" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <h2 className="text-2xl font-black text-[#2A1C0F] uppercase">
                  Үйлчилгээний нөхцөл
                </h2>
                <hr className="border-gray-100" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  Хэрэглэгч захиалга өгснөөр үйлчилгээний нөхцөлийг зөвшөөрсөнд
                  тооцогдоно. Хаяг болон утасны дугаараа буруу оруулснаас үүдсэн
                  хүргэлтийн саатлыг хэрэглэгч өөрөө хариуцахыг анхаарна уу.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
