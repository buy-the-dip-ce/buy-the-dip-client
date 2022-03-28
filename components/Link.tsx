import type { Component } from "solid-js"

const Link: Component<{ href: string }> = ({ href, children }) => {
    const onClick = (e: Event) => {
        e.preventDefault()

        const locationChangeEvent = new CustomEvent("locationchange", {
            composed: true,
            detail: { href: href },
        })
        window.dispatchEvent(locationChangeEvent)
    }
    return (
        <a href={href} onClick={onClick}>
            {children}
        </a>
    )
}

export default Link
