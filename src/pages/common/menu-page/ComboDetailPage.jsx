import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComboById } from "../../../api/comboApi";
import LoadingOverlay from "../../../components/loading/LoadingOverlay";
import ComboDetail from "./ComboDetail";
import useCallApi from "../../../api/useCallApi";
import { ComboApi } from "../../../api/endpoint";
const useDishData = (id) => {
  const [combo, setCombo] = useState({});
  const [dishCombo, setDishCombo] = useState([]);
  const [images, setImages] = useState([]);
  const { callApi, error, loading } = useCallApi();
  const fetchData = async () => {
    try {
      const response = await callApi(`${ComboApi.GET_ALL}/${id}`);
      if (response?.isSuccess) {
        const { combo, dishCombo, imgs } = response?.result;
        setImages(imgs);
        setCombo(combo);
        setDishCombo(dishCombo);
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lấy dữ liệu");
    } finally {
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { combo, dishCombo, images, loading };
};

export function ComboDetailPage() {
  const { id } = useParams();
  const { combo, dishCombo, images, loading } = useDishData(id);
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
      <LoadingOverlay isLoading={loading} />
      <ComboDetail
        comboData={comboData}
        key={`combodetail`}
        handleBack={handleBack}
      />
    </div>
  );
}
