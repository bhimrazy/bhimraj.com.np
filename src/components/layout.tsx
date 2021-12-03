import React, { ReactNode } from 'react'
import Head from 'next/head'
import Header from './header'
import Footer from './footer'

export default function Layout({children}:{children:ReactNode}) {
    const title='BHIMRAJ YADAV'
    return (
        <div className="flex font-display flex-col antialiased bg-white">
            <Head>
                <title>{title}</title>
            </Head>
            <Header/>
            {children}
            <Footer/>
        </div>
    )
}
