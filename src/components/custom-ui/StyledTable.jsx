import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
    background-color: #ad0303;
    color: white;
    height: 70px;
    white-space: nowrap; // Prevents text from wrapping
    overflow: hidden; // Hides overflowing text
    text-overflow: ellipsis; // Adds ellipsis (...) if text is too long
    max-width: 200px; // Optional: set a max-width to control column size
  }
  .ant-table-tbody > tr > td {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
    white-space: nowrap; // Applies same text wrapping prevention to cells
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ant-space {
    width: 100%;
  }
`;
