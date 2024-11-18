import { Typography } from "@material-tailwind/react";
import { Button } from "antd";

function ComboCard({ formatPrice, formatDate, onClick, combo }) {
  return (
    <div key={combo.comboId} className="m-4 shadow-lg rounded-lg">
      <div color="blue" className="relative h-56">
        <img
          src={combo?.image}
          alt={combo?.name}
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className="p-4">
        <Typography variant="h5" className="mb-2">
          {combo?.name}
        </Typography>
        <Typography>
          <div dangerouslySetInnerHTML={{ __html: combo?.description }} />
        </Typography>
        <Typography className="mt-4">
          <span className="font-bold">Giá:</span> {formatPrice(combo?.price)}
        </Typography>
        {combo?.discount > 0 && (
          <Typography className="mt-2 text-red-500">
            <span className="font-bold">Giảm:</span> {combo?.discount}%
          </Typography>
        )}
        <Typography className="mt-4">
          <span className="font-bold">Ngày bắt đầu:</span>{" "}
          {formatDate(combo?.startDate)}
        </Typography>
        <Typography className="mt-2">
          <span className="font-bold">Ngày kết thúc:</span>{" "}
          {formatDate(combo?.endDate)}
        </Typography>
      </div>
      <div className="p-4">
        <div className="flex justify-center">
          <Button
            className="bg-red-700 text-white py-2 px-4 rounded-md"
            onClick={onClick}
          >
            Đặt ngay
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ComboCard;
