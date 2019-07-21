import React, { Fragment, useRef } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

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

const Example = () => {
  const fixedGridRef = useRef();
  return (
    <AutoSizer>
      {({ height, width }) => (
        <Fragment>
          <Grid
            className="Grid"
            columnCount={2}
            columnWidth={100}
            height={height}
            overscanColumnCount={1}
            overscanRowCount={1}
            ref={fixedGridRef}
            rowCount={1000}
            rowHeight={35}
            width={200}
          >
            {Cell}
          </Grid>
          <Grid
            className="Grid"
            columnCount={998}
            columnWidth={100}
            height={height}
            onScroll={({ scrollTop }) => fixedGridRef.current.scrollTo({ scrollTop })}
            overscanColumnCount={1}
            overscanRowCount={1}
            rowCount={1000}
            rowHeight={35}
            style={{ position: 'absolute', left: 200, top: 0 }}
            width={width - 200}
          >
            {Cell}
          </Grid>
        </Fragment>
      )}
    </AutoSizer>
  );
}

export default Example;
