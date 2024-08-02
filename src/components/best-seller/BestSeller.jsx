const BestSeller = () => {
  return (
    <div className="border-y-4 border-red-600 my-10 container">
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
              src="https://s3-alpha-sig.figma.com/img/046a/fd40/5bd1cbd0cff53310483846bc935d1cca?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jkSZ88QyfzkWEAsRVFtwugkAkObSJ9XmsOEX5P6SbqiT3Dijx2noNXs9G8Uutlos8l6a5jxeKE5wMITF4WoqNCfSbqCZIbbSbRfEtEVRnM-ihezpYGwGJcQhdECmgg67a~MZH7OpM5fuFlFdsSYY9zMWKY5r-QuxnZ0cLBmKaCjmSDt3IWZMiArBLMJ3O-kcX3rd9Eu-ZI1H6slKTBaJS8ejnOQ3YGEaRueUehtAuPUD6Xg7qq5C8-ekXlSlaK8Kz9RzfAYbb029MjHKWASK8qVbBP0PibIp3WCEW9~31ApHaRo3DpCslJJNoQ3~fqQypzdXbSX4K70ZMMBUJ9JtOQ__"
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
              src="https://s3-alpha-sig.figma.com/img/046a/fd40/5bd1cbd0cff53310483846bc935d1cca?Expires=1721606400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jkSZ88QyfzkWEAsRVFtwugkAkObSJ9XmsOEX5P6SbqiT3Dijx2noNXs9G8Uutlos8l6a5jxeKE5wMITF4WoqNCfSbqCZIbbSbRfEtEVRnM-ihezpYGwGJcQhdECmgg67a~MZH7OpM5fuFlFdsSYY9zMWKY5r-QuxnZ0cLBmKaCjmSDt3IWZMiArBLMJ3O-kcX3rd9Eu-ZI1H6slKTBaJS8ejnOQ3YGEaRueUehtAuPUD6Xg7qq5C8-ekXlSlaK8Kz9RzfAYbb029MjHKWASK8qVbBP0PibIp3WCEW9~31ApHaRo3DpCslJJNoQ3~fqQypzdXbSX4K70ZMMBUJ9JtOQ__"
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
