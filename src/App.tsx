import * as React from "react"
import {
    notasReducer,
    INITIAL_STATE,
    IReducerState,
    IPeriodo
} from "./services/Notas/Reducer"

function getDados(): IReducerState {
    return {
        periodos: [
            {
                id: 1,
                descricao: "1º Bimestre",
                fechado: true,
                valor: 5.3
            },
            {
                id: 2,
                descricao: "2º Bimestre",
                fechado: true,
                valor: 8.3
            },
            {
                id: 3,
                descricao: "3º Bimestre",
                fechado: false,
                valor: 0
            },
            {
                id: 4,
                descricao: "4º Bimestre",
                fechado: false,
                valor: 0
            }
        ],
        exame: {
            fechado: false,
            valor: ""
        },
        media: "",
        situacao: ""
    } as IReducerState
}

export default function App() {
    const [state, dispatch] = React.useReducer(notasReducer, INITIAL_STATE)

    return (
        <div className="App">
            <button
                onClick={() => {
                    dispatch({ type: "LOAD_NOTAS", payload: getDados() })
                }}
            >
                Load
            </button>

            {state?.periodos?.map((periodo: IPeriodo) => {
                return (
                    <div key={periodo.id}>
                        <label> {periodo.descricao} </label>
                        <label> {periodo.valor} </label>
                        <input
                            value={periodo.valor}
                            onChange={(e) => {
                                dispatch({
                                    type: "UPDATE_PERIODO",
                                    payload: {
                                        id: periodo.id,
                                        valor: e.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                )
            })}

            <div>Media: {state?.media}</div>
            <div>Situacao: {state?.situacao}</div>

            <pre>{JSON.stringify(state.exame, null, 2)}</pre>
        </div>
    )
}
