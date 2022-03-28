import React from "react"
import Head from "next/head"
import PortfolioMainPage from "../../components/portfolio/PortfolioMainPage"

const index: React.FC = () => {
    return (
        <>
            <Head>
                <title>Buy The Dip</title>
            </Head>
            <PortfolioMainPage />
        </>
    )
}

export default index
