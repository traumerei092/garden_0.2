import '../styles/globals.css'
import {AppProps} from "next/app";
import Container from "@/layout/Container/index";

// @ts-ignore
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp