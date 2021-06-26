import React from 'react';
import { BrowserRouter, Route, Switch, } from 'react-router-dom';

import { AuthContextProvider } from './context/AuthContext';

import Home from './pages/Home';
import NewRoom from './pages/NewRoom';
import Room from './pages/Room';
import AdminRoom from './pages/AdminRoom';
import OpenRooms from './pages/OpenRooms';


function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/rooms/new' exact component={NewRoom} />
          <Route path='/rooms/open' exact component={OpenRooms} />
          <Route path='/rooms/:id' component={Room} />
          <Route path='/admin/rooms/:id' component={AdminRoom} /> 
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
