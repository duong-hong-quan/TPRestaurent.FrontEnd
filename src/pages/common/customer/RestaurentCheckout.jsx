import { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react";
import {
  Utensils,
  Tag,
  Phone,
  Gift,
  CreditCard,
  Wallet,
  ShoppingCart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RestaurantCheckout = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loyalPoints, setLoyalPoints] = useState("");
  const [coupon, setCoupon] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const orderedDishes = [
    {
      name: "Phở Bò Đặc Biệt",
      price: 12.99,
      image: "/api/placeholder/100/100",
    },
    {
      name: "Gỏi Cuốn Tôm Thịt",
      price: 8.5,
      image: "/api/placeholder/100/100",
    },
    {
      name: "Cơm Tấm Sườn Nướng",
      price: 18.99,
      image: "/api/placeholder/100/100",
    },
    { name: "Chè Ba Màu", price: 6.99, image: "/api/placeholder/100/100" },
  ];

  const subtotal = orderedDishes.reduce((sum, dish) => sum + dish.price, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="container mx-auto my-8 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="overflow-hidden shadow-xl">
          <CardBody className="p-0">
            <motion.div
              className="p-8 text-red-700"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Typography
                variant="h3"
                className="text-center uppercase font-bold mb-2"
              >
                Thiên Phú
              </Typography>
              <Typography variant="h6" className="text-center opacity-80">
                Xin cảm ơn quý khách
              </Typography>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 p-8">
              <div className="space-y-6">
                <Typography variant="h5" className="font-bold text-red-800">
                  Thông tin khách hàng
                </Typography>
                <AnimatePresence>
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                  >
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input
                        type="tel"
                        label="Số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        icon={<Phone className="h-5 w-5 text-red-500" />}
                        className="border-red-500"
                      />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input
                        type="text"
                        label="Điểm tích luỹ"
                        value={loyalPoints}
                        onChange={(e) => setLoyalPoints(e.target.value)}
                        icon={<Gift className="h-5 w-5 text-red-500" />}
                        className="border-red-500"
                      />
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }}>
                      <Input
                        type="text"
                        label="Mã khuyến mãi"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        icon={<Tag className="h-5 w-5 text-red-500" />}
                        className="border-red-500"
                      />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                <div className="space-y-2">
                  <Typography className="font-semibold text-red-700">
                    Phương thức thanh toán
                  </Typography>
                  <motion.div
                    className="flex flex-col gap-2"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Radio
                      name="payment"
                      label={
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 " />
                          <Typography className="font-medium">VNPAY</Typography>
                        </div>
                      }
                      checked={paymentMethod === "credit_card"}
                      onChange={() => setPaymentMethod("credit_card")}
                    />
                    <Radio
                      name="payment"
                      label={
                        <div className="flex items-center gap-2">
                          <Wallet className="h-5 w-5" />
                          <Typography className="font-medium">Momo</Typography>
                        </div>
                      }
                      checked={paymentMethod === "wallet"}
                      onChange={() => setPaymentMethod("wallet")}
                    />
                  </motion.div>
                </div>
                <motion.div
                  className="space-y-2  p-6 rounded-lg shadow-md"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <Typography className="text-red-800">Tạm tính:</Typography>
                    <Typography className="font-semibold text-red-800">
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center">
                    <Typography className="text-red-800">Phí TAX:</Typography>
                    <Typography className="font-semibold text-red-800">
                      ${tax.toFixed(2)}
                    </Typography>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-red-300">
                    <Typography variant="h6" className="text-red-800 font-bold">
                      Tổng cộng:
                    </Typography>
                    <Typography variant="h6" className="text-red-800 font-bold">
                      ${total.toFixed(2)}
                    </Typography>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    fullWidth
                    size="lg"
                    className="flex items-center justify-center gap-2  py-3 text-lg"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    Tiến hành thanh toán
                  </Button>
                </motion.div>
              </div>
              <div className="p-6 rounded-lg shadow-lg">
                <Typography
                  variant="h5"
                  className="mb-6 flex items-center gap-2 text-red-800 font-bold"
                >
                  <Utensils className="h-6 w-6 text-red-600" />
                  Các món bạn đã dùng
                </Typography>
                <List className="space-y-4">
                  {orderedDishes.map((dish, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListItem className="p-0 bg-white bg-opacity-60 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                        <ListItemPrefix>
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-16 h-16 object-cover rounded-l-lg"
                          />
                        </ListItemPrefix>
                        <div className="flex w-full justify-between items-center py-2 px-4">
                          <div>
                            <Typography variant="h6" className="font-semibold">
                              {dish.name}
                            </Typography>
                          </div>
                          <Typography
                            variant="h6"
                            color="red"
                            className="font-bold"
                          >
                            ${dish.price.toFixed(2)}
                          </Typography>
                        </div>
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default RestaurantCheckout;
