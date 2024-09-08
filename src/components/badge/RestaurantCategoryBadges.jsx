import React from "react";
import { Tag, Space } from "antd";
import {
  AppstoreOutlined,
  FireOutlined,
  ShopOutlined,
  CoffeeOutlined,
  BarsOutlined,
  TeamOutlined,
  CrownOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";

const getIcon = (name) => {
  switch (name) {
    case "APPETIZER":
    case "SIDEDISH":
      return <AppstoreOutlined />;
    case "SOUP":
    case "HOTPOT":
    case "HOTPOT_BROTH":
      return <FireOutlined />;
    case "BBQ":
      return <ShopOutlined />;
    case "DRINK":
      return <CoffeeOutlined />;
    case "DESSERT":
      return <CrownOutlined />;
    case "SAUCE":
      return <CarryOutOutlined />;
    default:
      return <BarsOutlined />;
  }
};

const getColor = (name) => {
  if (name.includes("HOTPOT")) return "red";
  if (name.includes("BBQ")) return "orange";
  if (name === "DRINK") return "blue";
  if (name === "DESSERT") return "purple";
  return "green";
};

export const CategoryTag = ({ category }) => (
  <Tag
    icon={getIcon(category.name)}
    // color={getColor(category.name)}
    style={{
      padding: "4px 8px",
      fontSize: "14px",
      backgroundColor: "#C01D2E",
      color: "white",
    }}
  >
    {category.vietnameseName}
  </Tag>
);

export const RestaurantCategoryTags = ({ categories }) => (
  <Space size={[8, 16]} wrap>
    {categories.map((category) => (
      <CategoryTag key={category.id} category={category} />
    ))}
  </Space>
);
