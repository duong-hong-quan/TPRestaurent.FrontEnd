import { useEffect, useState } from "react";
import { getAllDishes } from "../../../api/dishApi";
import BestSeller from "../../../components/best-seller/BestSeller";
import IntroHome from "../../../components/intro-home/IntroHome";
import MenuDish from "../../../components/menu-dish/MenuDish";
import Reservation from "../../../components/reservation/Reservation";
import SliderHome from "../../../components/slider-home/SliderHome";
import TopFeedback from "../../../components/top-feedback/TopFeedback";
import TopVoucher from "../../../components/top-voucher/TopVoucher";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

export const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await getAllDishes("", 1, 10);
      if (response.isSuccess) {
        setDishes(response?.result?.items);
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="">
      <LoadingOverlay isLoading={isLoading} />

      {!isLoading && (
        <>
          <SliderHome />
          <div className="container mx-auto  ">
            <TopVoucher />
            <IntroHome />
            <BestSeller />
            <MenuDish dishes={dishes} />
            <TopFeedback />

            <Reservation />
          </div>
        </>
      )}
    </div>
  );
};
