import TopVoucherDetail from "./top-voucher-detail/TopVoucherDetail";
import Slider from "react-slick";

const TopVoucher = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };
  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold my-5">Khuyến mãi hot</h1>
        <h3 className="text-lg font-bold my-5 text-mainColor">Xem thêm</h3>
      </div>
      <div className="md:block hidden">
        <Slider {...settings}>
          <TopVoucherDetail />
          <TopVoucherDetail />
          <TopVoucherDetail />
        </Slider>
      </div>
      <div className="md:hidden grid grid-cols-1  gap-4">
        <TopVoucherDetail />
        <TopVoucherDetail />
        <TopVoucherDetail />
        <TopVoucherDetail />
        <TopVoucherDetail />
        <TopVoucherDetail />
      </div>
    </>
  );
};
export default TopVoucher;
