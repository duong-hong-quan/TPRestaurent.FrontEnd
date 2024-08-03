const BestSeller = () => {
  return (
    <div className="border-y-4 border-red-600 my-10 container p-4">
      <h1 className="font-pt-serif text-center text-2xl text-red-600 ">
        BEST SELLER
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="relative my-4 p-4 overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/700f/68fc/75bdeaf6443c88920329accb42e785ee?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zo4oJ4qSsQqtApQ~EA3gq1P6vlWNLlrnHL-8zLDWpvGnH5r9-2WhcH6AebSTCAkEAMjQYlYG3gYa~iXLiaKSaIR5Vd-0u3seQU3Q6qsuQ-TQAw0ZltxTKpKZ~k1p-qwsJ99JQ8nPRXTNhuy3aeJaT8ZhIuZUHHAs4nN7ozOjcTXwh5evZ~97pUib62x09rhmTIC6iIi4MXyVXMnZEhTZosHzIVtSghYQD8TRaiuFVgr3CwcNeDrmMszQAYGRcuNerdVSD0FB~x2x3G47K~as-LlG77ZqSp6uMS1Gme37RMxTwofOpjzOCbL285beEF-EDZ07-fldrPeriS888FoZYg__)",
            }}
          />
          {/* Overlay to reduce background sharpness */}
          <div className="absolute inset-0 bg-white opacity-90"></div>

          {/* Content */}
          <div className="relative flex z-10">
            <img
              className="rounded-full h-48 w-48 object-cover"
              src="https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__"
              alt="Phật nhảy tường"
            />
            <div className="mx-4">
              <h3 className="font-bold text-md">Phật nhảy tường</h3>
              <p className="text-sm">
                Phật nhảy tường được mệnh danh là món "cao lương mỹ vị" của vùng
                đất Phúc Kiến. Bên cạnh tên gọi độc lạ, món ăn này còn rất bổ
                dưỡng, có tác dụng tốt trong việc làm sạch ngũ tạng...
              </p>
              <p className="text-red-600 text-md cursor-pointer my-2">
                Xem thêm
              </p>
            </div>
          </div>
        </div>
        <div className="relative my-4 p-4 overflow-hidden">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://s3-alpha-sig.figma.com/img/700f/68fc/75bdeaf6443c88920329accb42e785ee?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Zo4oJ4qSsQqtApQ~EA3gq1P6vlWNLlrnHL-8zLDWpvGnH5r9-2WhcH6AebSTCAkEAMjQYlYG3gYa~iXLiaKSaIR5Vd-0u3seQU3Q6qsuQ-TQAw0ZltxTKpKZ~k1p-qwsJ99JQ8nPRXTNhuy3aeJaT8ZhIuZUHHAs4nN7ozOjcTXwh5evZ~97pUib62x09rhmTIC6iIi4MXyVXMnZEhTZosHzIVtSghYQD8TRaiuFVgr3CwcNeDrmMszQAYGRcuNerdVSD0FB~x2x3G47K~as-LlG77ZqSp6uMS1Gme37RMxTwofOpjzOCbL285beEF-EDZ07-fldrPeriS888FoZYg__)",
            }}
          />
          {/* Overlay to reduce background sharpness */}
          <div className="absolute inset-0 bg-white opacity-90"></div>

          {/* Content */}
          <div className="relative flex z-10">
            <img
              className="rounded-full h-48 w-48 object-cover"
              src="https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__"
              alt="Phật nhảy tường"
            />
            <div className="mx-4">
              <h3 className="font-bold text-md">Phật nhảy tường</h3>
              <p className="text-sm">
                Phật nhảy tường được mệnh danh là món "cao lương mỹ vị" của vùng
                đất Phúc Kiến. Bên cạnh tên gọi độc lạ, món ăn này còn rất bổ
                dưỡng, có tác dụng tốt trong việc làm sạch ngũ tạng...
              </p>
              <p className="text-red-600 text-md cursor-pointer my-2">
                Xem thêm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSeller;
