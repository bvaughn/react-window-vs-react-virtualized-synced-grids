import React, { Fragment, memo, useEffect, useRef } from "react";
import { FixedSizeGrid as Grid, areEqual } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import "./shared.css";

const Cell = memo(({ columnIndex, rowIndex, style }) => (
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
), areEqual);

const MultiGrid = ({ height, width }) => {
  const activeGridRef = useRef();
  const passiveGridRef = useRef();

  useEffect(() => {
    const current = activeGridRef.current;
    const onScroll = event => {
      passiveGridRef.current.scrollTo({
        scrollTop: event.currentTarget.scrollTop
      });
    };
    current.addEventListener('scroll', onScroll);
    return () => current.removeEventListener('scroll', onScroll);
  });

  return (
    <Fragment>
      <Grid
        className="Grid"
        columnCount={2}
        columnWidth={100}
        height={height}
        overscanColumnCount={1}
        overscanRowCount={1}
        ref={passiveGridRef}
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
        overscanColumnCount={1}
        overscanRowCount={1}
        outerRef={activeGridRef}
        rowCount={1000}
        rowHeight={35}
        style={{ position: 'absolute', left: 200, top: 0 }}
        width={width - 200}
      >
        {Cell}
      </Grid>
    </Fragment>
  );
};

const Example = () => {
  return (
    <AutoSizer>
      {({ height, width }) => (
        <MultiGrid height={height} width={width} />
      )}
    </AutoSizer>
  );
}

export default Example;
