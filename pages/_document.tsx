import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" data-theme="lofi">
      <meta httpEquiv="Content-Security-Policy"
        content="default-src *; 
                  style-src * 'self' 'unsafe-inline' 'unsafe-eval'; 
                  script-src * 'self' 'unsafe-inline' 'unsafe-eval';"></meta>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
