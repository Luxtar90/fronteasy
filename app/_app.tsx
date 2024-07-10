import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <ToastContainer />
    </SessionProvider>
  );
};

export default MyApp;
