import React from "react";
import { AutoSizer, MultiGrid } from "react-virtualized";

import "./shared.css";

const Cell = ({ columnIndex, rowIndex, style }) => (
  <div
    className={
      columnIndex % 2
        ? rowIndex % 2 === 0
          ? "GridItemOdd"
          : "GridItemEven"
        : rowIndex % 2
        ? "GridItemOdd"
        : "GridItemEven"
    }
    style={style}
  >
    r{rowIndex}, c{columnIndex}
  </div>
);

const Example = () => (
  <AutoSizer>
    {({ height, width }) => (
      <MultiGrid
        className="Grid"
        cellRenderer={Cell}
        columnCount={1000}
        columnWidth={100}
        fixedColumnCount={2}
        fixedRowCount={0}
        height={height}
        overscanColumnCount={1}
        overscanRowCount={1}
        rowCount={1000}
        rowHeight={35}
        width={width}
      />
    )}
  </AutoSizer>
);

export default Example;
