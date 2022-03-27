import { createContext, useContext, createEffect } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { PortfolioStock } from "../lib/api/portfolio"
import { isServer } from "solid-js/web"

type State = {
    common: { isOwnPortfolio: boolean }
    portfolio: { [key: string]: PortfolioStock[] }
}

type Actions = {
    setPortfolio(_portfolio: { [key: string]: PortfolioStock[] }): void
    setIsOwnPortfolio: (bool: boolean) => void
}

type Store = [State, any]

const StoreContext = createContext<Store>()

export function StoreProvider(props: any) {
    const [state, setState] = createStore<State>({
        common: {
            isOwnPortfolio: false,
        },
        portfolio: {},
    })
    if (!isServer) {
        if (localStorage.portfolio)
            setState("portfolio", JSON.parse(localStorage.portfolio))
        createEffect(
            () => (localStorage.portfolio = JSON.stringify(state.portfolio))
        )
    }

    const actions = {
        setPortfolio(_portfolio) {
            console.log("바궈라", _portfolio)

            setState(
                produce((_state) => {
                    _state.portfolio = _portfolio
                })
            )
        },
        addPortfolioCategory() {
            setState(
                produce((_state) => {
                    let newName = "새카테고리1"
                    let index = 1
                    while (1) {
                        if (_state.portfolio[newName]) {
                            if (!index) {
                                newName = `새카테고리1`
                            } else {
                                newName = `새카테고리${index}`
                            }
                            index += 1
                        } else {
                            break
                        }
                    }
                    if (_state.portfolio[newName]) {
                        newName = ""
                    }
                    _state.portfolio[newName] = [] as any
                })
            )
        },
        setIsOwnPortfolio(bool: boolean) {
            setState(
                produce((_state) => {
                    _state.common.isOwnPortfolio = bool
                })
            )
        },
    }

    const store: Store = [state, actions]
    return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    )
}
export function useStore() {
    return useContext<Store>(StoreContext as any)
}
