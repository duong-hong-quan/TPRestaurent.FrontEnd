import React from "react";
import useCallApi from "../../api/useCallApi";
import { OrderApi } from "../../api/endpoint";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { formatPrice } from "../../util/Utility";

const BestSellerItem = ({
  image,
  title,
  description,
  price,
  dishId,
  comboId,
}) => (
  <div className="relative p-4 overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center" />
    <div className="absolute inset-0 bg-white opacity-90" />
    <div className="relative flex flex-col sm:flex-row z-10">
      <img
        className="rounded-full h-32 w-32 sm:h-48 sm:w-48 object-cover mx-auto sm:mx-0"
        src={image}
        alt={title}
      />
      <div className="mt-4 sm:mt-0 sm:ml-4">
        <h3 className="font-bold text-md">{title}</h3>
        <p className="text-sm mt-2">{description}</p>
        {price && (
          <p className="text-sm mt-2 font-semibold">{formatPrice(price)} </p>
        )}
        <NavLink
          to={dishId ? `/product/${dishId}` : `/combo/${comboId}`}
          className="text-red-600 text-md cursor-pointer mt-2"
        >
          Xem thêm
        </NavLink>
      </div>
    </div>
  </div>
);

const BestSellerSection = ({ title, items }) => (
  <div className="my-8">
    <h2 className="font-bold text-xl text-red-600 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <BestSellerItem
          key={item.dishId || item.comboId}
          description={item.description}
          image={item.image}
          price={item.price}
          title={item.title}
          dishId={item.dishId}
          comboId={item.comboId}
        />
      ))}
    </div>
  </div>
);

const BestSeller = () => {
  const [bestDishes, setBestDishes] = React.useState([]);
  const [bestCombos, setBestCombos] = React.useState([]);
  const { callApi, error, loading } = useCallApi();

  const formatItems = (data) => {
    const { dishes, combos } = data.result;

    // Filter available and non-deleted items
    const availableDishes = dishes
      .filter((dish) => dish.isAvailable && !dish.isDeleted)
      .map((dish) => ({
        image: dish.image,
        title: dish.name,
        description: dish.description.replace(/<[^>]*>/g, ""),
        dishId: dish.dishId,
        preparationTime: dish.preparationTime,
      }));

    const availableCombos = combos
      .filter((combo) => combo.isAvailable && !combo.isDeleted)
      .map((combo) => ({
        image: combo.image,
        title: combo.name,
        description: combo.description.replace(/<[^>]*>/g, ""),
        comboId: combo.comboId,
        price: combo.price,
        preparationTime: combo.preparationTime,
      }));

    return {
      dishes: availableDishes,
      combos: availableCombos,
    };
  };

  const fetchData = async () => {
    const response = await callApi(
      `${OrderApi.GET_BEST_SELLER_DISH_AND_COMBO}?startTime=${dayjs()
        .subtract(1, "month")
        .format("YYYY-MM-DD")}&endTime=${dayjs().format(
        "YYYY-MM-DD"
      )}&topNumber=4`,
      "GET"
    );

    if (response.isSuccess) {
      if (response?.result?.items) {
        // If API returns pre-formatted items
        const dishes = response.result.items.filter(
          (item) => item.type === "dish"
        );
        const combos = response.result.items.filter(
          (item) => item.type === "combo"
        );
        setBestDishes(dishes);
        setBestCombos(combos);
      } else {
        // Format the raw data
        const formattedItems = formatItems(response);
        setBestDishes(formattedItems.dishes);
        setBestCombos(formattedItems.combos);
      }
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading best sellers...</p>
      </div>
    );
  }

  const hasBestSellers = bestDishes.length > 0 || bestCombos.length > 0;

  return (
    <div className="border-y-4 border-red-600 my-10 container mx-auto px-4">
      <h1 className="font-bold text-center text-2xl text-red-600 my-4">
        BEST SELLER
      </h1>

      {hasBestSellers ? (
        <>
          {bestDishes.length > 0 && (
            <BestSellerSection title="Món Ăn Bán Chạy" items={bestDishes} />
          )}
          {bestCombos.length > 0 && (
            <BestSellerSection title="Combo Bán Chạy" items={bestCombos} />
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <p>No best sellers available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
