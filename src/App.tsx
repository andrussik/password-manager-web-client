import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import AppRoutes from './routes/AppRoutes';
import UserProvider from './UserContext';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/header/Header';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <Header />
            <AppRoutes />
          </UserProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
