import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Table } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useCallApi from '../../../api/useCallApi';
import { AccountApi } from '../../../api/endpoint';

const { Title } = Typography;

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
`;

const SidebarWrapper = styled.div`
  width: 30%;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0,0,0,0.15);
`;

const MainContentWrapper = styled.div`
  width: 70%;
  padding: 20px;
  background-color: #ffffff;
`;

const StyledTitle = styled(Title)`
  &.ant-typography {
    color: #ad0303;
    margin-bottom: 20px;
  }
`;

const StyledList = styled(List)`
  .ant-list-item {
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover {
      background-color: #ffe6e6;
    }

    &.selected {
      background-color: #ad0303;

    .ant-list-item-meta {
      .ant-list-item-meta-title {
         color: white;
       }
      .ant-list-item-meta-description {

        color: white;
        }
     }
    }

    .ant-list-item-meta {
      .ant-list-item-meta-title {
        color: black;
      }
    }
  }
`;
const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #ad0303;
    color: white;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #ffe6e6;
  }
`;


const deliveryHistory = [
  { id: 1, date: '2024-10-21', address: '123 Đường ABC, Quận 1, TP.HCM', status: 'Đã giao' },
  { id: 2, date: '2024-10-20', address: '456 Đường XYZ, Quận 2, TP.HCM', status: 'Đang giao' },
];

const AdminShipperPage = () => {
  const [selectedShipper, setSelectedShipper] = useState(null);
 const [shippers, setShippers] = useState([]);
 const {callApi,error,loading}= useCallApi();
  useEffect(() => {
    const fetchShippers = async () => {
      const result = await callApi(`${AccountApi.GET_ACCOUNTS_BY_ROLE_NAME}/shipper/1/100`, 'GET');
      if (result.isSuccess) {
        setShippers(result.result?.items);
      }
    };
    fetchShippers();
  }, []);
  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <Container>
      <SidebarWrapper>
        <StyledTitle level={3}>Danh sách Shipper</StyledTitle>
        <StyledList
          dataSource={shippers}
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedShipper(item)}
              className={selectedShipper?.id === item.id ? 'selected' : ''}
            >
              <List.Item.Meta
                avatar={<UserOutlined style={{ color: '#ad0303', fontSize: '20px' }} />}
                title={item.firstName}
                description={item.phoneNumber}
              />
            </List.Item>
          )}
        />
      </SidebarWrapper>

      <MainContentWrapper>
        <StyledTitle level={3}>
          {selectedShipper
            ? `Lịch sử giao hàng của ${selectedShipper.firstName}`
            : 'Chọn một shipper để xem lịch sử giao hàng'}
        </StyledTitle>
        {selectedShipper && (
          <StyledTable dataSource={deliveryHistory} columns={columns} />
        )}
      </MainContentWrapper>
    </Container>
  );
};

export default AdminShipperPage;