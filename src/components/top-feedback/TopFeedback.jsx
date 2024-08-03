import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TopFeedback = () => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: true,
    centerPadding: "0",
  };

  return (
    <div className=" max-w-4xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Trải nghiệm từ khách hàng
      </h2>
      <Slider {...settings}>
        <div className="relative h-80 md:h-96 bg-[#A31927]">
          <img
            src="https://s3-alpha-sig.figma.com/img/56c7/d6e3/e61a6ac19c35d8c524538acadf4345c0?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YhqrX2SqaeOZhbaLQ3j88DrtbnsYrOVkcaWNT6oNPzDV40jkr31XUZy879kLfqqIh-b4xJ0qtNz9SL8ax-Zi1iFenOMpCBC-RjAOsmvEGuZd0ZK3fBPYfCU1jwJcvJT6GBuukz-Zj3Ls-ey9YL9v62gfrX~XPxZcMqKzU8G094lFNPQFgeQdDsJzrl7CT4uLClNZdbMePl8zrvhKKU5~s9iB2U67nrWYNB9XoAJmMdH97vNqqJTeY7EtPRGRqxmUSyAgW4S5pPIFcI2Hs4dXkCg2L~xU4Wn3mSYqkeRWNwoYYhgvCdxrOCDvnpZlNrYoAcLLCOQoKhpTs3KE3wRUMQ__"
            alt="Feedback"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
            <p className="text-white text-lg md:text-xl text-center px-8 py-4 font-semibold">
              "Từ dịch vụ, món ăn, không gian đến cách bài trí không chê vào đâu
              được. Xứng đáng 10 sao!."
            </p>
            <p className="text-yellow-400 text-lg md:text-xl text-center px-8 py-4 font-semibold">
              Nguyễn Văn Tèo
            </p>
          </div>
        </div>
        <div className="relative h-80 md:h-96 bg-red-500">
          <img
            src="https://s3-alpha-sig.figma.com/img/56c7/d6e3/e61a6ac19c35d8c524538acadf4345c0?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YhqrX2SqaeOZhbaLQ3j88DrtbnsYrOVkcaWNT6oNPzDV40jkr31XUZy879kLfqqIh-b4xJ0qtNz9SL8ax-Zi1iFenOMpCBC-RjAOsmvEGuZd0ZK3fBPYfCU1jwJcvJT6GBuukz-Zj3Ls-ey9YL9v62gfrX~XPxZcMqKzU8G094lFNPQFgeQdDsJzrl7CT4uLClNZdbMePl8zrvhKKU5~s9iB2U67nrWYNB9XoAJmMdH97vNqqJTeY7EtPRGRqxmUSyAgW4S5pPIFcI2Hs4dXkCg2L~xU4Wn3mSYqkeRWNwoYYhgvCdxrOCDvnpZlNrYoAcLLCOQoKhpTs3KE3wRUMQ__"
            alt="Feedback"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
            <p className="text-white text-lg md:text-xl text-center px-8 py-4 font-semibold">
              "Từ dịch vụ, món ăn, không gian đến cách bài trí không chê vào đâu
              được. Xứng đáng 10 sao!."
            </p>
            <p className="text-yellow-400 text-lg md:text-xl text-center px-8 py-4 font-semibold">
              Nguyễn Văn Tèo
            </p>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default TopFeedback;
