import React, { ReactNode } from 'react'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'

export default function Layout({children}:{children:ReactNode}) {
    return (
        <div className="flex font-display flex-col antialiased min-h-screen bg-white">
            <Head>
                <title>Software Engineer | AI Enthusiast | BHIMRAJ YADAV</title>
            </Head>
            <Header/>
            {children}
            <Footer/>
        </div>
    )
}
