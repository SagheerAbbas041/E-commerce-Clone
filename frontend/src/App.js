import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState, useCallback } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const fetchUserDetails = useCallback(async (explicitToken) => {
    try {
      const token = explicitToken || localStorage.getItem("token");
      const headers = {
        "content-type": "application/json"
      };

      if (token && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const dataResponse = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
        headers: headers
      });

      const dataApi = await dataResponse.json();

      if (dataResponse.ok && dataApi.success) {
        const userData = dataApi?.data?.user || dataApi?.data;
        dispatch(setUserDetails(userData));
      } else {
        dispatch(setUserDetails(null));
      }
    } catch (error) {
      console.error("User fetch error:", error);
      dispatch(setUserDetails(null));
    }
  }, [dispatch]);

  const fetchUserAddToCart = useCallback(async (explicitToken) => {
    try {
      const token = explicitToken || localStorage.getItem("token");
      const headers = {
        "content-type": "application/json"
      };

      if (token && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
        headers: headers
      });

      const dataApi = await dataResponse.json();

      if (dataResponse.ok && dataApi.success) {
        setCartProductCount(dataApi?.data?.count ?? dataApi?.count ?? 0);
      } else {
        setCartProductCount(0);
      }
    } catch (error) {
      console.error("Cart count fetch error:", error);
      setCartProductCount(0);
    }
  }, []);

  // Fetch Order Count Logic
  const fetchUserOrderCount = useCallback(async (explicitToken) => {
    try {
      const token = explicitToken || localStorage.getItem("token");
      const headers = {
        "content-type": "application/json"
      };

      if (token && token !== "undefined") {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const dataResponse = await fetch(SummaryApi.orderList.url, {
        method: SummaryApi.orderList.method,
        credentials: 'include',
        headers: headers
      });

      const dataApi = await dataResponse.json();

      if (dataResponse.ok && dataApi.success) {
        setOrderCount(dataApi?.data?.length || 0);
      } else {
        setOrderCount(0);
      }
    } catch (error) {
      console.error("Order count fetch error:", error);
      setOrderCount(0);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
    fetchUserOrderCount();
  }, [fetchUserDetails, fetchUserAddToCart, fetchUserOrderCount]);

  return (
    <>
      <Context.Provider value={{
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
        orderCount,
        fetchUserOrderCount
      }}>
        <ToastContainer position='top-center' />

        <Header />
        <main className='min-h-[calc(100vh-120px)] pt-16'>
          <Outlet />
        </main>
        <Footer />
      </Context.Provider>
    </>
  );
}

export default App;