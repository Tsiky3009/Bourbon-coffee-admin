import Navbar from "@/components/navbar";
import style from "@/pages/styles/home.module.css";

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
