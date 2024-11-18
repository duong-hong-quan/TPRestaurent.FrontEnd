import { useEffect, useState, useMemo } from "react";
import { Button } from "@material-tailwind/react";
import ComboCard from "../../../components/menu-dish/ComboCard";
import Pagination from "../../../components/pagination/Pagination";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useCallApi from "../../../api/useCallApi";
import { ComboApi } from "../../../api/endpoint";
import { debounce } from "lodash";
import { Select, Input, Row, Col, Space } from "antd";

const { Option } = Select;

const MenuPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [combos, setCombos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(1000000);

  const { callApi, loading } = useCallApi();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchCombos = async (query) => {
    try {
      const params = new URLSearchParams({
        keyword: query || "",
        category: selectedCategory || "",
        startPrice: minPrice || 0,
        endPrice: maxPrice || 1000000,
      });

      const endpoint = `${
        ComboApi.GET_ALL
      }/${currentPage}/${10}?${params.toString()}`;
      const data = await callApi(endpoint, "GET");

      if (data?.isSuccess) {
        setCombos(data?.result);
        setTotalPages(data?.result?.totalPages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const debouncedFetchCombos = useMemo(
    () => debounce((query) => fetchCombos(query), 1000),
    [currentPage, selectedCategory, minPrice, maxPrice]
  );

  useEffect(() => {
    fetchCombos(searchQuery);
  }, [currentPage, selectedCategory, minPrice, maxPrice]);

  useEffect(() => {
    return () => {
      debouncedFetchCombos.cancel();
    };
  }, [debouncedFetchCombos]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedFetchCombos(value);
  };

  return (
    <div className="my-16 container">
      <LoadingOverlay isLoading={loading} />
      <h1 className="uppercase text-red-800 font-bold text-center text-3xl mb-8">
        Khám phá thực đơn của chúng tôi
      </h1>

      {/* Filter Controls */}
      <div className=" container text-black p-4 rounded-lg shadow-md mb-10">
        <Row gutter={[16, 16]} align="middle" justify="center">
          <Col xs={24} md={6}>
            <label className="block font-semibold mb-2">Danh mục</label>
            <Select
              allowClear
              placeholder="Chọn danh mục"
              onChange={(value) => setSelectedCategory(value)}
              className="w-full"
            >
              <Option value={0}>Lẩu</Option>
              <Option value={1}>Đồ nướng BBQ</Option>
              <Option value={2}>Lẩu và đồ nướng</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <label className="block font-semibold mb-2">Giá từ</label>
            <Input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full"
              min={0}
            />
          </Col>
          <Col xs={12} md={4}>
            <label className="block font-semibold mb-2">Giá đến</label>
            <Input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
              min={0}
            />
          </Col>
          <Col xs={24} md={8}>
            <label className="font-semibold block mb-2">Tìm kiếm món ăn</label>
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </Col>
        </Row>
      </div>

      {/* Combo Cards */}
      <div className=" grid grid-cols-1 md:grid-cols-3 gap-4">
        {combos?.length > 0 ? (
          combos.map((combo) => (
            <motion.div
              key={combo.comboId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ComboCard combo={combo} />
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Không có món ăn nào phù hợp.
          </p>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MenuPage;
