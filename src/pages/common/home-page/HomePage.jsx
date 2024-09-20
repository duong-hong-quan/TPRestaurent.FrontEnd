import { useEffect, useState } from "react";
import BestSeller from "../../../components/best-seller/BestSeller";
import IntroHome from "../../../components/intro-home/IntroHome";
import MenuDish from "../../../components/menu-dish/MenuDish";
import SliderHome from "../../../components/slider-home/SliderHome";
import TopFeedback from "../../../components/top-feedback/TopFeedback";
import TopVoucher from "../../../components/top-voucher/TopVoucher";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import useCallApi from "../../../api/useCallApi";
import { DishApi } from "../../../api/endpoint";

export const HomePage = () => {
  const [dishes, setDishes] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { callApi, error, loading } = useCallApi();
  const fetchData = async () => {
    try {
      if (selectedCategory === null) {
        const response = await callApi(
          `${DishApi.GET_ALL}/${1}/${pageSize}`,
          "GET"
        );
        if (response.isSuccess) {
          setDishes(response?.result?.items);
        }
      } else {
        const response = await await callApi(
          `${DishApi.GET_ALL}/${1}/${pageSize}?type=${selectedCategory}`,
          "GET"
        );
        if (response.isSuccess) {
          setDishes(response?.result?.items);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
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
      <LoadingOverlay isLoading={loading} />

      {!loading && (
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
