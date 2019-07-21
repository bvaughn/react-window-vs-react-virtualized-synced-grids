import React, { useEffect, useRef } from "react";
import { findDOMNode } from "react-dom";
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

const MultiGridWrapper = ({ height, width }) => {
  const ref = useRef();

  useEffect(() => {
    setTimeout(() => {
      const div = findDOMNode(ref.current);
      const grids = div.querySelectorAll('.ReactVirtualized__Grid');
      window.registerScrollTarget(grids[1]);
    });
  }, []);

  return (
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
      ref={ref}
      rowCount={1000}
      rowHeight={35}
      width={width}
    />
  );
};

const Example = () => (
  <AutoSizer>
    {({ height, width }) => (
      <MultiGridWrapper height={height} width={width} />
    )}
  </AutoSizer>
);

export default Example;
