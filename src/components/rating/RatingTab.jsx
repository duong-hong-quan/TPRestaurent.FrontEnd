import { StarFilled } from "@ant-design/icons";
import { Image } from "antd";
import { formatDate } from "../../util/Utility";

const RatingTab = ({
  reviews,
  selectedStarFilter,
  numberOfRating,
  averageRating,
  setSelectedStarFilter,
}) => {
  const starCounts = [5, 4, 3, 2, 1].map(
    (star) =>
      reviews?.filter((review) => review?.rating?.pointId === star).length
  );

  const filteredReviews = selectedStarFilter
    ? reviews?.filter((review) => review?.rating.pointId === selectedStarFilter)
    : reviews;

  return (
    <div className="mt-8">
      <div className="flex items-start mb-8">
        <div className="text-center mr-8">
          <div className="text-5xl font-bold text-red-600">{averageRating}</div>
          <div className="flex justify-center my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarFilled
                key={star}
                className={`text-lg ${
                  star <= Math.round(averageRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{numberOfRating} đánh giá</div>
        </div>
        <div className="flex-grow">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center mb-1">
              <span className="w-12 text-sm">{star} sao</span>
              <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2">
                <div
                  className={`${
                    starCounts[5 - star] == 0 ? `bg-gray-200` : `bg-yellow-400`
                  } h-2 rounded-full`}
                  style={{
                    width: `${(starCounts[5 - star] / numberOfRating) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="w-12 text-right text-sm">
                {starCounts[5 - star]}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <span className="mr-2 font-semibold">Lọc đánh giá:</span>
        {[null, 5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            onClick={() => setSelectedStarFilter(star)}
            className={`mr-2 px-3 py-1 rounded ${
              selectedStarFilter === star
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {star === null ? "Tất cả" : `${star} sao`}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredReviews?.map((review) => (
          <div
            key={review?.rating?.ratingId}
            className="bg-white p-6 rounded-lg"
          >
            <div className="flex items-start mb-4">
              <img
                src={review?.rating?.createByAccount?.avatar}
                alt={review?.rating?.createByAccount?.avatar}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="flex-grow">
                <h3 className="text-xl font-semibold">
                  {review?.rating?.createByAccount?.firstName}
                </h3>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <StarFilled
                      key={i}
                      className={`text-lg ${
                        i < review?.rating?.pointId
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {formatDate(review?.rating?.createDate)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">
              {" "}
              <strong>Đánh giá: </strong>
              {review?.rating?.title}
            </p>
            {review?.ratingImgs?.length > 0 && (
              <div className="flex items-center space-x-4">
                {review.ratingImgs.map((img) => (
                  <Image
                    key={img.ratingImgId}
                    src={img.path}
                    alt={img.path}
                    width={100}
                    height={100}
                    className="object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default RatingTab;
