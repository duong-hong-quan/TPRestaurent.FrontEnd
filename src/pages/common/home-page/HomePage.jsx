import { useEffect, useState } from "react";
import { getAllDishes } from "../../../api/dishApi";
import BestSeller from "../../../components/best-seller/BestSeller";
import IntroHome from "../../../components/intro-home/IntroHome";
import MenuDish from "../../../components/menu-dish/MenuDish";
import SliderHome from "../../../components/slider-home/SliderHome";
import TopFeedback from "../../../components/top-feedback/TopFeedback";
import TopVoucher from "../../../components/top-voucher/TopVoucher";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";

export const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(9);
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await getAllDishes("", 1, pageSize);
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
  }, [pageSize]);
  const handleAddItem = () => {
    setPageSize(pageSize + 3);
  };
  return (
    <div className="">
      <LoadingOverlay isLoading={isLoading} />

      {!isLoading && (
        <>
          <div className="container">
            <SliderHome />
            <TopVoucher />
            <IntroHome />
            <BestSeller />
            <MenuDish dishes={dishes} handleAddItem={handleAddItem} />
            <TopFeedback />

            {/* <Reservation /> */}
          </div>
        </>
      )}
    </div>
  );
};
