import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Auction from './Auction';
import BackendPage from './pages/BackendPage'; // 您的 Backend 组件

function App() {
    return (
        <Router>
            <Switch>
                <Route index path="/" Component={Auction} />
                <Route path="/admin" Component={BackendPage} /> {/* BackendPage 对应的 URI */}
            </Switch>
        </Router>
    );
}

export default App;
