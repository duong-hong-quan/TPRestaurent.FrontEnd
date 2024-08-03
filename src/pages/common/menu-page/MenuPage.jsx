import DishCard from "../../../components/menu-dish/dish-card/DishCard";

const MenuPage = () => {
  const categories = [
    "Món khai vị",
    "Món chính",
    "Món tráng miệng",
    "Đồ uống",
    "Đặc sản",
  ];
  return (
    <div className="my-16">
      <h1 className="uppercase font-bold text-center">
        Khám phá thực đơn của chúng tôi
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {categories.map((category, index) => (
          <button
            key={index}
            className="px-4 py-2 border-2 border-red-500 rounded-md hover:bg-red-100 transition-colors duration-300"
          >
            {category}
          </button>
        ))}
      </div>

      <div className="container grid grid-cols-4">
        <DishCard />
        <DishCard />
        <DishCard />
        <DishCard />
      </div>
    </div>
  );
};
export default MenuPage;
