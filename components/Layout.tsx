import React from "react";
import styles from "../styles/Layout.module.css";

const Layout: React.FC = ({ children }) => {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1>TypeScript KanBan</h1>
                <div>{children}</div>
            </main>
        </div>
    )
}

export default Layout;