import { SessionProvider } from "next-auth/react";
import "../styles/globals.css"; // Import your global styles if needed

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
