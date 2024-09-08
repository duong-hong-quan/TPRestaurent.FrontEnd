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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (selectedCategory === null) {
        const response = await getAllDishes("", "", 1, pageSize);
        if (response.isSuccess) {
          setDishes(response?.result?.items);
        }
      }
      const response = await getAllDishes(selectedCategory, "", 1, pageSize);
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

  const menuCategories = [
    { name: "APPETIZER", icon: "fa-martini-glass" },
    { name: "SOUP", icon: "fa-temperature-high" },
    { name: "HOTPOT", icon: "fa-fire-burner" },
    { name: "BBQ", icon: "fa-lemon" },
    { name: "HOTPOT_BROTH", icon: "fa-martini-glass" },
    { name: "HOTPOT_MEAT", icon: "fa-scroll" },
    { name: "HOTPOT_SEAFOOD", icon: "fa-martini-glass" },
    { name: "HOTPOT_VEGGIE", icon: "fa-martini-glass" },
    { name: "BBQ_MEAT", icon: "fa-martini-glass" },
    { name: "BBQ_SEAFOOD", icon: "fa-martini-glass" },
    { name: "HOTPOT_TOPPING", icon: "fa-martini-glass" },
    { name: "BBQ_TOPPING", icon: "fa-martini-glass" },
    { name: "SIDEDISH", icon: "fa-martini-glass" },
    { name: "DRINK", icon: "fa-martini-glass" },
    { name: "DESSERT", icon: "fa-martini-glass" },
    { name: "SAUCE", icon: "fa-martini-glass" },
  ];

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
            <MenuDish
              dishes={dishes}
              handleAddItem={handleAddItem}
              fetchDishes={fetchData}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
              menuCategories={menuCategories}
            />
            <TopFeedback />

            {/* <Reservation /> */}
          </div>
        </>
      )}
    </div>
  );
};
