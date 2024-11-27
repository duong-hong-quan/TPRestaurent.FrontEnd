import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useCallApi from "../../api/useCallApi";
import { RatingApi } from "../../api/endpoint";
import { useEffect, useState } from "react";

const TopFeedback = () => {
  const { callApi, loading, error } = useCallApi();
  const [feedbacks, setFeedbacks] = useState([]);
  const fetchFeedbacks = async () => {
    const response = await callApi(
      `${RatingApi.GET_ALL_RATING_FOUR_TO_FIVE_STAR}/1/10`,
      "GET"
    );
    if (response.isSuccess) {
      setFeedbacks(response.result?.items);
    }
  };
  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
    <div className=" max-w-7xl mx-auto my-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        Trải nghiệm từ khách hàng
      </h2>
      <Slider {...settings}>
        {feedbacks.map((feedback, index) => (
          <div key={index} className="relative h-80 md:h-96 bg-[#A31927]">
            <img className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center rounded-lg">
              <p className="text-white text-lg md:text-xl text-center px-8 py-4 font-semibold">
                "{feedback?.content}"
              </p>
              <p className="text-yellow-400 text-lg md:text-xl text-center px-8 py-4 font-semibold">
                {feedback?.createByAccount?.firstName}
              </p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TopFeedback;
