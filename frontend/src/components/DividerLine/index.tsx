import React, { useState, useEffect } from 'react'
import styles from "./style.module.scss";

const DividerLine = () => {

    return (
        <div className={styles.divider}>
            <div className={styles.line}></div>
        </div>
    )
}

export default DividerLine