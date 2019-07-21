import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ReactVirtualized from './ReactVirtualized';
import ReactWindow from './ReactWindow';
import './App.css';

const Menu = () => (
  <nav>
    <ul>
      <li>
        <Link to="/react-window">react-window</Link>
      </li>
      <li>
        <Link to="/react-virtualized">react-virtualized</Link>
      </li>
    </ul>
  </nav>
);

function AppRouter() {
  return (
    <Router>
      <Route path="/" exact component={Menu} />
      <Route path="/react-window" component={ReactWindow} />
      <Route path="/react-virtualized" component={ReactVirtualized} />
    </Router>
  );
}

export default AppRouter;
