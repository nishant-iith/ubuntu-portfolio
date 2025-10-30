import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>Nishant Portfolio - Ubuntu 18.04 Edition</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Nishant Portfolio - Ubuntu 18.04 Edition" />
            <meta name="description"
                content="Nishant's Personal Portfolio Website. Ubuntu 18.04 themed, B.Tech Biomedical Engineering student at IIT Hyderabad with experience in software development and machine learning." />
            <meta name="author" content="Nishant (nishant-iith)" />
            <meta name="keywords"
                content="nishant, nishant portfolio, iit hyderabad, biomedical engineering, software developer, machine learning, python, cpp, ubuntu 18.04 portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />

            {/* Search Engine */}
            <meta name="image" content="/images/logos/fevicon.png" />
            {/* Schema.org for Google */}
            <meta itemProp="name" content="Nishant Portfolio - Ubuntu 18.04 Edition" />
            <meta itemProp="description"
                content="Nishant's Personal Portfolio Website. Ubuntu 18.04 themed, B.Tech Biomedical Engineering student at IIT Hyderabad with experience in software development and machine learning." />
            <meta itemProp="image" content="/images/logos/fevicon.png" />
            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Nishant Portfolio - Ubuntu 18.04 Edition" />
            <meta name="twitter:description"
                content="Nishant's Personal Portfolio Website. Ubuntu 18.04 themed, B.Tech Biomedical Engineering student at IIT Hyderabad with experience in software development and machine learning." />
            <meta name="twitter:site" content="nishant-iith" />
            <meta name="twitter:creator" content="nishant-iith" />
            <meta name="twitter:image:src" content="/images/logos/logo_1024.png" />
            {/* Open Graph general (Facebook, Pinterest & Google+) */}
            <meta property="og:title" content="Nishant Portfolio - Ubuntu 18.04 Edition" />
            <meta property="og:description"
                content="Nishant's Personal Portfolio Website. Ubuntu 18.04 themed, B.Tech Biomedical Engineering student at IIT Hyderabad with experience in software development and machine learning." />
            <meta property="og:image" content="/images/logos/logo_1200.png" />
            <meta property="og:url" content="https://nishant-iith.github.io/" />
            <meta property="og:site_name" content="Nishant Personal Portfolio" />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:type" content="website" />

            {/* Favicon - Using correct path */}
            <link rel="icon" type="image/svg+xml" href="/fevicon.svg" />
            <link rel="icon" href="/fevicon.svg" />
            <link rel="icon" type="image/png" href="/fevicon.png" />
            <link rel="apple-touch-icon" href="/images/logos/logo.png" />
        </Head>
    )
}
