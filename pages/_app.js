import Layout from '../components/Layout';
import 'semantic-ui-css/semantic.min.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
