import { BellIcon } from "@heroicons/react/24/solid";
import tableImg from "../../assets/imgs/table.png";
const NotificationBell = ({ count }) => (
  <div className="absolute top-0 right-2 flex items-center">
    <BellIcon className="h-8 w-8 text-yellow-500" />
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  </div>
);

const TableCard = ({ table, onClick }) => {
  return (
    // <Card
    //   key={table.tableId}
    //   className="cursor-pointer transform transition-transform hover:scale-105"
    //   onClick={() => onClick(table.tableSessionId)}
    // >
    //   <CardBody className="flex flex-col justify-center items-center p-4">
    //     <div className="relative w-32 h-32 rounded-full flex justify-center items-center mb-2 bg-red-100">
    //       <Typography variant="h4" className="font-bold text-red-900">
    //         {table.tableName}
    //       </Typography>
    //       <NotificationBell count={Math.floor(table.unCheckedNumberOfDishes)} />
    //     </div>
    //   </CardBody>
    // </Card>
    <div
      className="relative cursor-pointer duration-500 ease-in-out hover:scale-105 w-full mt-20"
      onClick={() => onClick(table.tableSessionId)}
    >
      <div className="absolute top-[-40%]">
        <img
          src={tableImg}
          alt="Lumpia with sides"
          className="w-full h-52 object-cover"
        />
        <div className="absolute top-[10%] right-[-5%] bg-red-600 text-white text-sm font-bold p-3 rounded-full shadow-xl">
          {table.tableName}
        </div>
      </div>
      <div className="flex items-center justify-center w-full h-60 bg-gradient-to-b from-white to-gray-200 hover:bg-gradient-to-b hover:from-white hover:to-gray-300 border border-white rounded-tr-[10px] rounded-bl-[10px] rounded-tl-[50px] rounded-br-[50px] shadow-lg">
        <div className="p-4 flex flex-col items-center">
          <div className="text-xl font-bold italic mt-10 mb-2">
            Ordered Table
          </div>
          <div className="flex justify-center items-baseline gap-1 text-gray-500">
            <div className="text-sm font-light">Số món ăn mới đặt: </div>
            <p className="text-sm font-bold">{table.unCheckedNumberOfDishes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableCard;
