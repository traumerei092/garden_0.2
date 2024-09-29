import React from 'react'
import styles from "./style.module.scss";

interface ContainerProps {
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
        <div className={styles.container} style={style}>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}

export default Container