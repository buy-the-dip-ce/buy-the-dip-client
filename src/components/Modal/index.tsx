import styles from "./style.module.css"
import { createSignal } from "solid-js"
import { Component } from "solid-js"

interface ModalProps {
    onClickOutside?: () => void
}

const Modal: Component<ModalProps> = ({ onClickOutside, children }) => {
    return (
        <div class={styles.modalWrapper} onClick={onClickOutside}>
            <div
                class={styles.modalContents}
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal
