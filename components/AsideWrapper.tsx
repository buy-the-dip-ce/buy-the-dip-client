import styled from "styled-components"
import Link from "next/link"
const Container = styled.div`
    .contentsWrapper {
        display: flex;
    }

    .contentsAside {
        width: 260px;
        height: 100vh;
        background-color: var(--grey300);
        padding-top: 39px;
        padding-left: 29px;
    }

    .logoTitle {
        font-size: var(--medium4);
        font-weight: bold;
        color: var(--cyan600);
        margin-bottom: 95px;
    }

    .navigation {
        display: flex;
        flex-direction: column;
    }

    .navigation a {
        font-size: var(--medium2);
        color: var(--grey700);
        font-weight: bold;
        margin-bottom: var(--medium4);
    }

    .contents {
        width: 100%;
        padding-left: var(--medium6);
        padding-right: var(--medium6);
        padding-top: var(--tlarge);
    }

    .contentsTitle {
        font-size: var(--medium3);
        color: var(--black500);
        font-weight: bold;
    }
`

const AsideWrapper: React.FC = ({ children }) => {
    return (
        <Container className="root">
            <div className={"contentsWrapper"}>
                <aside className={"contentsAside"}>
                    <h1 className={"logoTitle"}>Buy The Dip</h1>
                    <nav className={"navigation"}>
                        <Link href="/posts">포트폴리오</Link>
                        <Link href="/posts">포트폴리오 생성기</Link>
                        <Link href="/posts">배당 캘린더</Link>
                    </nav>
                </aside>
                <div className={"contents"}>{children}</div>
            </div>
        </Container>
    )
}

export default AsideWrapper
