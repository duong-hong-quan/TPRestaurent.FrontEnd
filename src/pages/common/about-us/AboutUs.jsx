import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const AboutUs = () => {
  const sections = [
    {
      title: "Our Story",
      content:
        "Founded in 2010, La Belle Époque has been a beacon of culinary excellence, blending traditional techniques with modern innovation. Our journey is one of passion, flavor, and unforgettable dining experiences.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
    {
      title: "Meet Chef Maria",
      content:
        "With over two decades of culinary mastery, Chef Maria Rodriguez brings her passion for French cuisine and international flavors to every dish. Her innovative approach keeps our menu fresh and exciting.",
      image:
        "https://images.unsplash.com/photo-1581349485608-9469926a8e5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
    },
    {
      title: "Our Philosophy",
      content:
        "At La Belle Époque, we believe in sustainable dining that doesn't compromise on taste. We work closely with local farmers to source the freshest ingredients, ensuring that each plate not only delights your palate but also supports our community.",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-red-100 to-yellow-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            className="mb-12 text-center font-serif text-5xl text-red-800"
          >
            Chào mừng đến với Thiên Phú
          </Typography>
        </motion.div>

        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex flex-col md:flex-row items-center mb-16 ${
              index % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-1/2 md:px-8">
              <Typography variant="h3" color="blue-gray" className="mb-4">
                {section.title}
              </Typography>
              <Typography color="gray" className="mb-4">
                {section.content}
              </Typography>
            </div>
          </motion.div>
        ))}

        <motion.div
          className="text-center mt-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NavLink
            to={"/booking"}
            className="font-bold py-3 px-6 bg-red-800 hover:bg-red-900 text-white rounded-md"
          >
            Đặt ngay
          </NavLink>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
