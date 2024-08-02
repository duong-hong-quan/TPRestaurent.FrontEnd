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
      <Slider {...settings}>
        <TopVoucherDetail />
        <TopVoucherDetail />
        <TopVoucherDetail />
      </Slider>
    </>
  );
};
export default TopVoucher;
