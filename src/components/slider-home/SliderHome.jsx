import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner from "../../assets/imgs/banner.png";

const SliderHome = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Auto-scroll every 3 seconds
    pauseOnHover: true, // Pause auto-scroll on hover
  };

  const slides = [
    {
      id: 1,
      image: banner,
      alt: "Món ăn BBQ ngon",
      title: "Ăn BBQ Thịnh Soạn",
      description:
        "Thưởng thức hương vị đậm đà và hấp dẫn của món BBQ, hoàn hảo cho những bữa tiệc ngoài trời.",
    },
    {
      id: 2,
      image: banner,
      alt: "Món ăn đặc sắc",
      title: "Món Ăn Đặc Biệt 2",
      description:
        "Khám phá sự hòa quyện tuyệt vời của các nguyên liệu tươi ngon trong món ăn độc quyền này.",
    },
    {
      id: 3,
      image: banner,
      alt: "Món ăn tuyệt vời",
      title: "Món Ăn Đặc Biệt 3",
      description:
        "Trải nghiệm ẩm thực đỉnh cao với món ăn được chế biến tinh tế và sang trọng.",
    },
  ];

  return (
    <div className="">
      <Slider {...settings} className="h-full relative">
        {slides.map((slide) => (
          <div key={slide.id} className="relative lg:h-screen">
            <img src={slide.image} alt={slide.alt} className="object-cover" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderHome;
