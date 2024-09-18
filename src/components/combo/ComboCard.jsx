import {
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import React from "react";

function ComboCard({ formatPrice, formatDate }) {
  return (
    <Card key={combo.comboId} className="m-4">
      <CardHeader color="blue" className="relative h-56">
        <img
          src={combo?.image}
          alt={combo?.name}
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <Typography variant="h5" className="mb-2">
          {combo?.name}
        </Typography>
        <Typography>{combo?.description}</Typography>
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
      </CardBody>
      <CardFooter className="pt-0 mt-auto">
        <div className="flex justify-center">
          <Button
            className="bg-red-700 text-white py-2 px-4 rounded-md"
            onClick={() => {
              setIsOpenComboDetail(true);
              setSelectedCombos(combo.comboId);
            }}
          >
            Đặt ngay
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ComboCard;
