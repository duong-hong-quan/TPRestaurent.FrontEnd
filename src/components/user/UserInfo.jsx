const UserInfo = () => {
  return (
    <div className="   bg-[#fff6e7] rounded-lg shadow-md p-4 max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-1">
          <img
            src="https://s3-alpha-sig.figma.com/img/c5b2/cff8/6e38c0f12499184f3e2db4ad43fe002a?Expires=1723420800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XElFO0NlvL-GVwSBedLNAJpGGfEneV0b9abf11mDOaJ3xC6xjMdi0YxRbCkJy1c8k8xf2lYL8VRghQ4SKOmfJXs8CRy6zpJ-4mkaK~OOitnxhn4cyuzrGxtfFXHXuAx~Zz9h6jMrmpcaQhFlfc-MhphzWW8epW3PpGxyfpmxrsQz7QCIIPJJf9p2ZnapOh~KQBWT6z~V9ybAXHl0RBYSbkwyz0phDHHYZoBqwNkhc8FWZ7NwQq1-LuMRWbi1LqvrvRVWdPU~U~Wv0l0G1z9OM1F4JKzwMlQVvjPErQLsUr8mAWfi2PS6ehC1TU6jOU1pxm1oUmDC2QwiMsluK~wftA__"
            alt="User Profile"
            className="w-full  object-cover"
          />
        </div>
        <div className="ml-10 md:col-span-5 space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 uppercase">
            DƯƠNG HỒNG QUÂN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-envelope"></i>
              <p>Quan@gmail.com</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-map-marker-alt"></i>
              <p>abc</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-phone"></i>
              <p>abc</p>
            </div>
            <div className="flex items-center space-x-2 text-red-700">
              <i className="fas fa-calendar"></i>
              <p>abc</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
