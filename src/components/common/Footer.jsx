import React from "react";
import {
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-[#FFECDE] py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            {/* <img
              src="https://s3-alpha-sig.figma.com/img/6370/d58f/85684958f4e64a77e423ef9b6d87c617?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=AcMLi8KD4ifjyhIwmXlDNXKVQENVfaMsnHhbg5CgV5gULxqza3Je5YkoKIg5tBq-g9YjzeqgYP27M2zxHAx60~r2dJDsl0wPGcYpgmI7it-Oec6L51dSUmObx2MNKZRN5ix-W01svquVSKfEPylex4WgBL7JCKccRZd0GUm2CiHwS3fLEgindI5JDAG4HRBZzndB3ML9w5UQl5PRvAMWk~OwfFbv29ND4CCqDayMAcYf~S8wp841Xd24HtQ7TCyMBw6AsucT6wyvDad-FhBh-fPhLCpo96VfrwWe1xvmzwHFUyZi4RHeW0RYoRxDQxqcOnPDzvGZnFCzcpXpha9UHA__"
              alt="Restaurant Logo"
              className="w-48 mb-4"
            /> */}
            <h3 className="text-xl font-semibold text-[#A31927]">
              Liên hệ chúng tôi
            </h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <PhoneOutlined className="mr-2" />
                <a href="tel:+84919782444" className="hover:text-[#A31927]">
                  +84 919 782 444
                </a>
              </p>
              <p className="flex items-center">
                <EnvironmentOutlined className="mr-2" />
                78 Đường Lý Tự Trọng, Phường 2, Đà Lạt, Lâm Đồng
              </p>
              <p className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                Mở cửa: 8:00 - 22:00 hàng ngày
              </p>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-2xl hover:text-[#A31927]">
                <FacebookOutlined />
              </a>
              <a href="#" className="text-2xl hover:text-[#A31927]">
                <InstagramOutlined />
              </a>
              <a href="#" className="text-2xl hover:text-[#A31927]">
                <TwitterOutlined />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#A31927]">Bản đồ</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.414087461861!2d108.43628477571312!3d11.94580643653575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3171130407d39e99%3A0xcb4cb0a9499c9ffd!2zTmjDoCBIw6BuZyBM4bqpdSBOxrDhu5tuZyBUaGnDqm4gUGjDug!5e0!3m2!1svi!2s!4v1722645339975!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow-md"
            ></iframe>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#A31927]">
              Đăng ký nhận tin
            </h3>
            <p>Nhận thông tin ưu đãi và sự kiện mới nhất của chúng tôi.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#A31927]"
              />
              <button
                type="submit"
                className="bg-[#A31927] text-white px-4 py-2 rounded-r-lg hover:bg-[#8B1621] transition duration-300"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          © 2024 Nhà Hàng Lẩu Nướng Thiên Phú. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
