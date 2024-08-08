import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import ComboCard from "../../../components/menu-dish/ComboCard";
import { Pagination } from "../../../components/pagination/Pagination";
import { getAllCombo } from "../../../api/comboApi";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { toast } from "react-toastify";

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [combos, setCombos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // Example total number of pages
  const [isLoading, setIsLoading] = useState(true);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchCombos = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCombo(searchQuery, currentPage, totalPages);
      if (data?.isSuccess) {
        setCombos(data?.result?.items);
        setTotalPages(data?.result?.totalPages);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, [searchQuery, currentPage]);

  const categories = [
    "Món khai vị",
    "Món chính",
    "Món tráng miệng",
    "Đồ uống",
    "Đặc sản",
  ];

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="my-16">
      <LoadingOverlay isLoading={isLoading} />
      <h1 className="uppercase font-bold text-center text-3xl mb-8">
        Khám phá thực đơn của chúng tôi
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="outlined"
            color="red"
            className="rounded-md transition-colors duration-300"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Tìm kiếm món ăn..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-md border border-gray-500 rounded-md p-2"
        />
      </div>

      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {combos.map((combo) => (
          <ComboCard key={combo.comboId} combo={combo} />
        ))}
      </div>
      <Pagination
        page={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MenuPage;