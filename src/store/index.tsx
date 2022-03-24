import { createContext, useContext } from "solid-js"
import { createStore, produce } from "solid-js/store"

const StoreContext = createContext()

export function StoreProvider(props) {
    const [state, setState] = createStore<{
            router: any
            portfolio: { [key: string]: string[] }
        }>({
            router: props.router,
            portfolio: {
                여행관련1: ["AAPL"],
                금융관련2: ["ABNB"],
            },
        }),
        actions = {
            setPortfolio(portfolios) {
                setState(
                    produce((_state) => {
                        _state.portfolio = portfolios
                    })
                )
            },
        }

    const store = [state, actions]

    return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    )
}

export function useStore() {
    return useContext(StoreContext)
}
