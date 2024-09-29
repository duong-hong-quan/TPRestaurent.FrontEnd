import PolicyBooking from "../../../components/policy/PolicyBooking";
import PolicyOrder from "../../../components/policy/PolicyOrder";

const PolicyPage = () => {
  return (
    <div className="container">
      <h3 className="text-2xl text-red-800 font-bold text-center my-10">
        CHÍNH SÁCH TẠI NHÀ HÀNG THIÊN PHÚ
      </h3>
      <PolicyBooking />
      <PolicyOrder />
    </div>
  );
};
export default PolicyPage;
