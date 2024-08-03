import BestSeller from "../../../components/best-seller/BestSeller";
import IntroHome from "../../../components/intro-home/IntroHome";
import DishCard from "../../../components/menu-dish/dish-card/DishCard";
import MenuDish from "../../../components/menu-dish/MenuDish";
import Reservation from "../../../components/reservation/Reservation";
import TopFeedback from "../../../components/top-feedback/TopFeedback";
import TopVoucher from "../../../components/top-voucher/TopVoucher";

export const HomePage = () => {
  return (
    <div className="container mx-auto">
      <img
        src="https://s3-alpha-sig.figma.com/img/62f9/82bc/377a67314fcee620f0c8791bf2c0b7f2?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DfbUwQo1s9YMArTXLgR9LxPMiEAHWlOLc5KWg2Ktoqtvg8Q8LGJECW6lj~GSwNKHKRhDBjRfyTxcHeaBjKLIkomAY17MXuGlzH4nB1QO6YBlFTuNQDvEiqe1qtjBDY6HSkcmP2KkxiSYrGRq-LQoMIBt5T5i1IxyCQCgjeKGJHT~-MzNdB25H-LHwbxW4JcMRDzes4EGou0LeSN~fgz1oufcDXduzZg4dzbYDqyVH1ABCDdnDmucPgYrZCrXPun~ff7zfI3RtHtPG23VZXhMwXm~pZsJCgve1gqbMV3p5ZlIcWkS9c9P1JX0R~RMLt4FsVj0D66VEtQv3LFZoJ7~yg__"
        alt=""
        className="w-full my-10"
      />
      <TopVoucher />
      <IntroHome />
      <BestSeller />
      <MenuDish />
      <TopFeedback />
      <Reservation />
    </div>
  );
};
