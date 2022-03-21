import { Portal, Show } from "solid-js/web"

import styles from "./style.module.css"
import { createSignal } from "solid-js"

const AddStockButton = () => {
    const [showModal, setShowModal] = createSignal(false)

    const onClick = () => {
        console.log("hi")
        setShowModal(true)
    }

    return (
        <>
            <button
                class={styles.addStockButton}
                type="button"
                onClick={onClick}
                on:Weird-Event={onClick}
            >
                + 주식 추가하기22
            </button>
            <Show when={showModal()} fallback={<div>Loading...</div>}>
                <div>My Content</div>
            </Show>
            {showModal() ? (
                <Portal mount={document.getElementById("root-modal")!}>
                    <div>My Content</div>
                </Portal>
            ) : (
                <Portal mount={document.getElementById("root-modal")!}>
                    <div>My Content</div>
                </Portal>
            )}
        </>
    )
}

export default AddStockButton
