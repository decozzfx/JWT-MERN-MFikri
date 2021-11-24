import {BrowserRouter as Router, Route, Routes} from 'react-router-dom' 
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div className='container'>
      <Router>
        <Routes>
          <Route exact path='/' element={<Login/>}/>
        </Routes>
        <Routes>
          <Route path='/register' element={<Register/>}/>
        </Routes>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
