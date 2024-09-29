import { NavLink } from "react-router-dom";
import imgDefault from "../../../assets/imgs/voucher1.png";
import { formatPrice } from "../../../util/Utility";
const TopVoucherDetail = ({ coupon }) => {
  return (
    <div className="mx-2 rounded-md max-w-[300px]">
      <img
        className="rounded-lg w-full object-cover max-w-[10rem]"
        src={coupon?.img || imgDefault}
      />
      <h1 className="sm:text-sm lg:text-lg xl:text-2xl font-bold my-5 text-wrap">
        {coupon?.code} - Giảm {coupon?.discountPercent} cho hoá đơn từ
        <span className="mx-1 "> {formatPrice(coupon?.minimumAmount)}</span>
      </h1>
      <p className="text-gray-400"> Hết hạn sau 2 ngày</p>
      <NavLink to={`/search`} className="text-mainColor">
        Dùng ngay
      </NavLink>
    </div>
  );
};
export default TopVoucherDetail;
