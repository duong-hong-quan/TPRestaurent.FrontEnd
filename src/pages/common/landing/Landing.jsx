import React from "react";
import { Apple, Play } from "lucide-react"; // Import the necessary icons

// Hero Section Component
const Hero = () => (
  <div className="bg-gradient-to-r from-red-900 to-red-300">
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
        Thay đổi trải nghiệm của bạn
      </h1>
      <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
        Tải xuống ứng dụng của chúng tôi và khám phá một thế giới khả năng hoàn
        toàn mới. Đơn giản, mạnh mẽ và được thiết kế dành cho bạn.
      </p>
      <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
        <a
          href="https://expo.dev/artifacts/eas/8UQnmjAH7SSN6ZJQ3fX31W.apk"
          className="inline-flex items-center justify-center bg-red-800 text-white px-8 py-3 rounded-lg hover:bg-red-900"
        >
          <Play className="mr-2" size={25} />
          App dành cho shipper của Thiên Phú
        </a>
        <a
          href="https://expo.dev/artifacts/eas/oxyaeg3hW9EupSat8RBbyq.apk"
          className="inline-flex items-center justify-center bg-red-800 text-white px-8 py-3 rounded-lg hover:bg-red-900"
        >
          <Play className="mr-2" size={25} />
          App dành cho thiết bị nhà hàng của Thiên Phú
        </a>
      </div>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Features Section Component
const Features = () => (
  <div className="py-20 bg-gray-50" id="features">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">
        Tính năng tuyệt vời
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Apple}
          title="Dễ sử dụng"
          description="Giao diện trực quan được thiết kế mang lại trải nghiệm tốt nhất cho người dùng."
        />
        <FeatureCard
          icon={Play}
          title="Nhanh chóng và đáng tin cậy"
          description="Hiệu suất nhanh bạn luôn có thể tin cậy."
        />
        <FeatureCard
          icon={Apple}
          title="Bảo mật"
          description="Dữ liệu của bạn được bảo vệ bằng bảo mật cấp doanh nghiệp."
        />
      </div>
    </div>
  </div>
);

// Download CTA Section Component
const DownloadCTA = () => (
  <div className="bg-red-900 py-16">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-white mb-8">
        Ready to Get Started?
      </h2>
      <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
        Join millions of users who have already transformed their experience
        with our app.
      </p>
      <button className="bg-white text-red-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
        Download Now
      </button>
    </div>
  </div>
);

// Main App Component
const Landing = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      {/* Add the DownloadCTA component to the Landing component */}
    </div>
  );
};

export default Landing;
