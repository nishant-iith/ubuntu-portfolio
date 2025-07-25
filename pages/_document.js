import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Security Headers */}
                    <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
                    <meta httpEquiv="X-Frame-Options" content="DENY" />
                    <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
                    <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
                <link rel="icon" type="image/svg+xml" href="/fevicon.svg" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument