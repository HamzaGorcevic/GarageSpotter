import React from "react";
import { Map } from "lucide-react";
import styles from "./loader.module.scss";

export function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <Map className={styles.icon} />
                <div className={styles.shadow} />
            </div>
            <h2 className={styles.title}>Loading Map</h2>
            <div className={styles.dots}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
            </div>
        </div>
    );
}
