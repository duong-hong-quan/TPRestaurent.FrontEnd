import DishCard from "./dish-card/DishCard";

const MenuDish = () => {
  return (
    <div className="bg-[#A31927] p-4">
      <h1 className="text-white text-center text-2xl font-pt-serif ">
        KHÁM PHÁ THỰC ĐƠN
      </h1>
      <a className="text-[#F2D2D5] text-md" href="">
        Xem tất cả
      </a>
      <div className="container grid grid-cols-7">
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-martini-glass"></i>
          </div>
          <p>Gợi ý</p>
        </div>
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-temperature-high"></i>{" "}
          </div>
          <p>Chiên nướng</p>
        </div>{" "}
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-fire-burner"></i>{" "}
          </div>
          <p>Nướng</p>
        </div>{" "}
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-lemon"></i>{" "}
          </div>
          <p>Xào</p>
        </div>{" "}
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-martini-glass"></i>
          </div>
          <p>Tráng miệng</p>
        </div>{" "}
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-scroll"></i>{" "}
          </div>
          <p>Cuốn/ cháo</p>
        </div>{" "}
        <div className="rounded-lg text-red-600 p-2 font-bold bg-white shadow-2xl w-24 text-center flex-col justify-center items-center">
          <div>
            <i className="fa-solid fa-martini-glass"></i>
          </div>
          <p>Khác</p>
        </div>{" "}
      </div>
      <div className="grid grid-cols-4 ">
        <DishCard />
        <DishCard />
        <DishCard />
        <DishCard />
      </div>
      <div className="flex justify-center">
        <button className="btn rounded-md shadow-md text-center">
          Xem thêm
        </button>
      </div>
    </div>
  );
};
export default MenuDish;
