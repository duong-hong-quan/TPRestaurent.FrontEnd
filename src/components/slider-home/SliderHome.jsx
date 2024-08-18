import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slider1 from "../../assets/imgs/slider/slider1.png";
import slider2 from "../../assets/imgs/slider/slider2.png";
import slider3 from "../../assets/imgs/slider/slider3.png";

const SliderHome = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: "linear",
  };

  const slides = [
    {
      id: 1,
      image: slider1,
      alt: "Món ăn BBQ ngon",
      title: "Ăn BBQ Thịnh Soạn",
      description:
        "Thưởng thức hương vị đậm đà và hấp dẫn của món BBQ, hoàn hảo cho những bữa tiệc ngoài trời.",
    },
    {
      id: 2,
      image: slider2,
      alt: "Món ăn đặc sắc",
      title: "Món Ăn Đặc Biệt 2",
      description:
        "Khám phá sự hòa quyện tuyệt vời của các nguyên liệu tươi ngon trong món ăn độc quyền này.",
    },
    {
      id: 3,
      image: slider3,
      alt: "Món ăn tuyệt vời",
      title: "Món Ăn Đặc Biệt 3",
      description:
        "Trải nghiệm ẩm thực đỉnh cao với món ăn được chế biến tinh tế và sang trọng.",
    },
  ];

  return (
    <div className="relative h-screen ">
      <Slider {...settings} className="h-full">
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-screen">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl text-center max-w-2xl">
                {slide.description}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderHome;
