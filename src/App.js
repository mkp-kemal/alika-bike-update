import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { HashRouter  as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { DetailProducts } from './pages/DetailProducts';
import { Checkout } from './pages/Checkout';
import { AddAddress } from './pages/AddAddress';
import { Basket } from './pages/Basket';
import { EditAddress } from './pages/EditAddress';
import { Pay } from './pages/Pay';
import { PayNow } from './pages/PayNow';
import { HomeAdmin } from './Admin/HomeAdmin';
import { Orders } from './Admin/Orders';
import { Test } from './pages/Test';
import { ThanksPayment } from './pages/Thanks';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/product' element={<DetailProducts/>} />
        <Route path='/checkout' element={<Checkout/>} />
        <Route path='/add-address' element={<AddAddress/>} />
        <Route path='/edit-address' element={<EditAddress/>} />
        <Route path='/cart' element={<Basket/>} />
        <Route path='/pay' element={<Pay/>} />
        <Route path='/buy' element={<PayNow/>} />

        <Route path='/test' element={<Test/>} />
        <Route path='/payment-success' element={<ThanksPayment/>} />

        {/* ADMIN */}
        <Route path='/admin' element={<HomeAdmin/>} />
        <Route path='/admin/order' element={<Orders/>} />
      </Routes>
    </Router>    
  );
}

export default App;
