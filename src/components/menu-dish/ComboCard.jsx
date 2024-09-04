import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { formatDate, formatPrice } from "../../util/Utility";
import { NavLink } from "react-router-dom";

const ComboCard = ({ combo }) => {
  return (
    <div className=" m-4 h-full grid">
      <CardHeader className="relative h-44">
        <img
          src={combo?.image}
          alt={combo?.name}
          className="h-full w-full object-cover"
        />
        {combo?.discount > 0 && (
          <div className="absolute mt-2 text-white font-bold top-0 bg-gray-800 px-2 py-1 rounded-md">
            <span className="font-bold">Giảm:</span> {combo?.discount}%
          </div>
        )}
      </CardHeader>
      <CardBody className="py-0">
        <Typography variant="h4" className="mb-2">
          {combo?.name}
        </Typography>
        <Typography className="mt-4 flex-col md:flex-row">
          <span className="font-bold text-red-800 text-xl">
            {formatPrice(combo?.price)}
          </span>
          &nbsp;
          {combo?.discount > 0 && (
            <span className="font-bold text-gray-400 text-xl line-through">
              {formatPrice(combo?.price)}
            </span>
          )}
        </Typography>

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
        <div className="flex justify-end ">
          <NavLink
            className="mt-autoinline-block w-fit bg-white text-red-700 border border-red-300 font-bold py-2 px-4 rounded-md "
            to={`/combo/${combo?.comboId}`}
          >
            Xem chi tiết{" "}
          </NavLink>
        </div>
      </CardFooter>
    </div>
  );
};

export default ComboCard;
