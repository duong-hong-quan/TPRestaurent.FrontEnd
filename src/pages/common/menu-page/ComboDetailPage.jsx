import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComboById } from "../../../api/comboApi";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import ComboDetail from "./ComboDetail";
const useDishData = (id) => {
  const [combo, setCombo] = useState({});
  const [dishCombo, setDishCombo] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    try {
      const response = await getComboById(id);
      if (response?.isSuccess) {
        const { combo, dishCombo, imgs } = response?.result;
        setImages(imgs);
        setCombo(combo);
        setDishCombo(dishCombo);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { combo, dishCombo, images, isLoading };
};

export function ComboDetailPage() {
  const { id } = useParams();
  const { combo, dishCombo, images, isLoading } = useDishData(id);
  const [comboData, setComboData] = useState({});
  const fetchData = async () => {
    try {
      const response = await getComboById(id);
      if (response?.isSuccess) {
        setComboData(response?.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [id]);
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <LoadingOverlay isLoading={isLoading} />
      <ComboDetail
        comboData={comboData}
        key={`combodetail`}
        handleBack={handleBack}
      />
    </div>
  );
}
