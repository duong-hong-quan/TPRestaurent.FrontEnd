import React from "react";
import useCallApi from "../../api/useCallApi";
import { OrderApi } from "../../api/endpoint";
import dayjs from "dayjs";
import { NavLink } from "react-router-dom";
import { formatPrice } from "../../util/Utility";
const truncateDescription = (description, wordLimit) => {
  const words = description.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return description;
};
const BestSellerItem = ({
  image,
  title,
  description,
  price,
  dishId,
  comboId,
  name,
}) => {
  const truncatedDescription = truncateDescription(description, 10);

  return (
    <div className="relative p-4 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0  rounded-xl opacity-90" />
      <div className="relative flex flex-col justify-center items-center z-10">
        <img
          className="rounded-full h-32 w-32 sm:h-48 sm:w-48 object-cover mx-auto sm:mx-0"
          src={image}
          alt={title}
        />
        <div className="mt-30 sm:mt-0 sm:ml-4">
          <h3 className="font-bold text-md ">{title}</h3>
          <p className="font-semibold text-center my-4">{name}</p>

          <div dangerouslySetInnerHTML={{ __html: truncatedDescription }} />
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
};
const BestSellerSection = ({ title, items }) => (
  <div className="my-8">
    <h2 className="font-bold text-xl uppercase text-red-600 text-center mb-4 ">
      {title}
    </h2>
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
          name={item.name}
        />
      ))}
    </div>
  </div>
);

const BestSeller = () => {
  const [bestDishes, setBestDishes] = React.useState([]);
  const [bestCombos, setBestCombos] = React.useState([]);
  const { callApi, error, loading } = useCallApi();

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
      setBestDishes(response?.result.dishes);
      setBestCombos(response?.result.combos);
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
    <div className="py-4 border-y-4 border-red-600 my-10 container mx-auto px-4">
      <h1 className="font-bold text-center text-4xl text-red-600 my-4">
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
