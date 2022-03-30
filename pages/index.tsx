import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const index: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/portfolios", "/portfolios");
  });
  return (
    <>
      <Head>
        <title>Buy The Dip</title>
      </Head>
    </>
  );
};

export default index;
