import React from "react";

const BestSellerItem = ({ image, title, description }) => (
  <div className="relative p-4 overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={
        {
          // backgroundImage: `url(${image})`,
        }
      }
    />
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
        <p className="text-red-600 text-md cursor-pointer mt-2">Xem thêm</p>
      </div>
    </div>
  </div>
);

const BestSeller = () => {
  const items = [
    {
      image:
        "https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__",
      title: "Phật nhảy tường",
      description:
        'Phật nhảy tường được mệnh danh là món "cao lương mỹ vị" của vùng đất Phúc Kiến. Bên cạnh tên gọi độc lạ, món ăn này còn rất bổ dưỡng, có tác dụng tốt trong việc làm sạch ngũ tạng...',
    },
    // Add more items as needed
  ];

  return (
    <div className="border-y-4 border-red-600 my-10 container mx-auto px-4">
      <h1 className="font-bold text-center text-2xl text-red-600 my-4">
        BEST SELLER
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <BestSellerItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
