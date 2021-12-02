import React from "react";
import styles from "../styles/Layout.module.css";
import Link from "next/link";

const Layout: React.FC = ({ children }) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <Link href="/projects">
                    <h1 style={{cursor: "pointer", textAlign: "left"}}>TypeScript KanBan</h1>
                </Link>
                <div>{children}</div>
            </main>
        </div>
    )
}

export default Layout;