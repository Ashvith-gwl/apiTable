import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Demo from './demo'

function App() {
  return (
    <Router>
    <Route exact path="/:id" component={Demo}/>
    <Route exact path="/" component={Demo}/>
    </Router>
  );
}

export default App;
