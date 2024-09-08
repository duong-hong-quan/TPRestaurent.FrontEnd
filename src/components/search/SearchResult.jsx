import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MenuDish from "../menu-dish/MenuDish";
import { getAllDishes } from "../../api/dishApi";
import LoadingOverlay from "../loading/LoadingOverlay";
import { Pagination } from "../pagination/Pagination";

function SearchResults() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [dishes, setDishes] = useState([]);
  const [totalPage, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const fetchData = async (query) => {
    try {
      setLoading(true);
      const response = await getAllDishes(query || "", currentPage, pageSize);
      if (response.isSuccess) {
        setDishes(response?.result?.items);
        setTotalPages(response?.result?.totalPages);
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q");

    if (query) {
      fetchData(query);
    } else {
      fetchData();
    }
  }, [location.search, pageSize]);

  if (loading) {
    return <LoadingOverlay isLoading={loading} />;
  }
  const handleAddItem = () => {
    setPageSize(pageSize + 3);
  };
  return (
    <div>
      <MenuDish dishes={dishes} handleAddItem={handleAddItem} />
    </div>
  );
}

export default SearchResults;
