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
import SearchPopover from "../../../components/search/SearchPopover";

export const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container mx-auto">
      <LoadingOverlay isLoading={isLoading} />

      {dishes.length > 0 && (
        <>
          <SliderHome />
          <TopVoucher />
          <IntroHome />
          <BestSeller />
          <MenuDish dishes={dishes} />
          <TopFeedback />

          <Reservation />
        </>
      )}
    </div>
  );
};
