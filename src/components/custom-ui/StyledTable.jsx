import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  // Ensure table can horizontally scroll if content is wider
  .ant-table {
    overflow-x: auto;
  }

  .ant-table-thead > tr > th {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;
    background-color: #ad0303;
    color: white;
    height: 70px;
    white-space: nowrap; // Prevents text from wrapping

    // Allow columns to size based on content
    &.ant-table-cell {
      width: auto !important;
      min-width: fit-content;
      padding: 0 8px;
    }
  }

  .ant-table-tbody > tr > td {
    text-align: center;
    vertical-align: middle;
    border-bottom: none;

    // Allow columns to size based on content
    &.ant-table-cell {
      width: auto !important;
      min-width: fit-content;
    }
  }

  .ant-space {
    width: 100%;
  }

  // Ensure horizontal scrolling is smooth
  .ant-table-container {
    overflow-x: auto;
  }
`;
