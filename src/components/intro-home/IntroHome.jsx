import bo from "../../assets/imgs/bo.png";
import salad from "../../assets/imgs/salad.png";
import restaurent from "../../assets/imgs/restaurent.png";
import cook from "../../assets/imgs/cook.png";
const IntroHome = () => {
  const features = [
    {
      img: bo,
      description:
        "Thịt bò tơ mới tập ăn cỏ: Ngọt - Mềm - Thơm Sữa - Tươi ngon.",
    },
    {
      img: salad,
      description:
        "Chế biến thành 40 món đặc sản: Hấp - Nướng - Chao - Xào - Nộm....",
    },
    {
      img: restaurent,
      description:
        "Không gian: Sang trọng- Tinh tế - Độc lạ - Tha Hồ Check - in",
    },
    {
      img: cook,
      description:
        "Chế biến thành 40 món đặc sản: Hấp - Nướng - Chao - Xào - Nộm....",
    },
  ];

  return (
    <div className="bg-[#FFECDE] py-16 mt-16">
      <div className="container mx-auto px-4">
        <h1 className=" text-center text-3xl md:text-4xl font-bold mb-12 text-red-600 ">
          Muốn ăn ngon - Đến ngay nhà hàng của chúng tôi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className=" rounded-xl overflow-hidden">
              <div className="flex justify-center">
                <img
                  className="w-44 h-44 object-cover  "
                  src={feature.img}
                  alt={`Feature ${index + 1}`}
                />
              </div>
              <div className="p-6">
                <p className="text-gray-800 text-center">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntroHome;
