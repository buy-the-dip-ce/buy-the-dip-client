import { Portal, Show } from "solid-js/web"

import styles from "./style.module.css"
import { createSignal, Component } from "solid-js"
import Modal from "../../Modal"
import SearchStockModal from "../SearchStockModal"

const AddStockButton: Component<{ category: string }> = ({ category }) => {
    const [showModal, setShowModal] = createSignal(false)

    const onClick = () => {
        setShowModal(true)
    }

    return (
        <>
            <button
                class={styles.addStockButton}
                type="button"
                onClick={onClick}
            >
                + 주식 추가하기22
            </button>
            <Show when={showModal()}>
                <Portal mount={document.getElementById("root-modal")!}>
                    <Modal
                        onClickOutside={() => {
                            setShowModal(false)
                        }}
                    >
                        <SearchStockModal category={category} />
                    </Modal>
                </Portal>
            </Show>
        </>
    )
}

export default AddStockButton
