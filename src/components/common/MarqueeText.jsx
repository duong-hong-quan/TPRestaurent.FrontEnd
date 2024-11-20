import React from "react";

const MarqueeText = () => {
  const text =
    "Chào mừng bạn đến với website của chúng tôi! Bạn có thể đặt bàn trước tại nhà hàng hoặc đặt giao tận nhà (với bán kính 10km tại thành phố Đà Lạt) qua website của chúng tôi. Tra cứu khung giờ đặt bàn vô cùng tiện lợi hơn với MR.CHEF AI. Mọi liên hệ vui lòng gọi vào hotline: +84 919 782 444";

  return (
    <div className="w-full overflow-hidden bg-yellow-50 p-1 xl:p-4">
      <div className="flex whitespace-nowrap">
        <span
          className="text-sm xl:text-lg font-bold text-red-800 inline-block ml-[100%] animate-marquee"
          style={{
            animation: "marquee 80s linear infinite",
          }}
        >
          {text}
        </span>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-200%);
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeText;
