import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
    background-color: #ad0303;
    color: white;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
  }
  .ant-space {
    width: 100%;
  }
`;
