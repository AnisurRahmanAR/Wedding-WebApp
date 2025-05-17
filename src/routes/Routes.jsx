import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import QRCodePage from '@/pages/QRCodePage';

<Route path="/qr" element={<QRCodePage />} />


import Home from "../pages/Home";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </Router>
  );
}
