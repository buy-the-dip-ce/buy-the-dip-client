import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import styled from "styled-components"

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    .modal-background {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 10;
    }

    .modalWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100vh;
        z-index: 100;
        background-color: #33333350;
        cursor: pointer;
    }

    .modalContents {
        background-color: white;
        border-radius: var(--small3);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
        cursor: default;
    }
`

interface IProps {
    children: React.ReactNode
    closePortal: () => void
}

const ModalPortal: React.FC<IProps> = ({ children, closePortal }) => {
    const ref = useRef<Element | null>()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (document) {
            console.log(document)
            const dom = document.querySelector("#root-modal")
            ref.current = dom
        }
    }, [])

    if (ref.current && mounted) {
        return createPortal(
            <Container>
                <div
                    className="modalWrapper"
                    onClick={closePortal}
                    role="presentation"
                >
                    <div className={"modalContents"}>{children}</div>
                </div>
            </Container>,
            ref.current
        )
    }
    return null
}

export default ModalPortal
