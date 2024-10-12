import { Badge, Tag } from "antd";

const DishSizeBages = ({ dishSize }) => {
  const getBadgeColor = (dishSize) => {
    switch (dishSize.id) {
      case 0:
        return "blue";
      case 1:
        return "red";
      case 2:
        return "green";
    }
  };
  return (
    <div>
      <Tag className="text-base" color={getBadgeColor(dishSize)}>
        {dishSize.vietnameseName}
      </Tag>
    </div>
  );
};
export default DishSizeBages;
