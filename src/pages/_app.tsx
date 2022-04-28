import ThemeStyles from 'components/ThemeStyles/ThemeStyles';
import type { AppProps } from 'next/app';
import 'normalize.css/normalize.css';
import 'styles/main.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
