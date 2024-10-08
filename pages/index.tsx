import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
//import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Head from "next/head";
import Navbar from "@/components/navbar";
import style from "@/pages/styles/home.module.css";

/*type ConnectionStatus = {
  isConnected: boolean;
};*/

const inter = Inter({ subsets: ["latin"] });

/*xport const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};*/

export default function Home() {
  return (
    <>
      <div className={style.body}>
        <div className={style.column_1}>
          <Navbar />
        </div>
        <div className={style.column_2}>
          <h1>Hello</h1>
        </div>
      </div>
    </>
  );
}
