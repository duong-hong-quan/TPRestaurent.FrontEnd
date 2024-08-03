import BestSeller from "../../../components/best-seller/BestSeller";
import IntroHome from "../../../components/intro-home/IntroHome";
import DishCard from "../../../components/menu-dish/dish-card/DishCard";
import MenuDish from "../../../components/menu-dish/MenuDish";
import Reservation from "../../../components/reservation/Reservation";
import SliderHome from "../../../components/slider-home/SliderHome";
import TopFeedback from "../../../components/top-feedback/TopFeedback";
import TopVoucher from "../../../components/top-voucher/TopVoucher";

export const HomePage = () => {
  return (
    <div className="container mx-auto">
      <SliderHome />
      <TopVoucher />
      <IntroHome />
      <BestSeller />
      <MenuDish />
      <TopFeedback />
      <Reservation />
    </div>
  );
};
