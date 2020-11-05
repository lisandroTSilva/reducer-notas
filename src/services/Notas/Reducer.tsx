export const INITIAL_STATE = {} as IReducerState

export interface IPeriodo {
    id: number
    descricao: string
    fechado: boolean
    valor: any
}

interface IExame {
    fechado: boolean
    valor: any
}

export interface IReducerState {
    periodos: IPeriodo[]
    exame: IExame
    media: number
    situacao: string
}

function updateMedia(newState: IReducerState, periodos: IPeriodo[]) {
    newState.media =
        periodos.reduce((acc: any, prev: any) => acc + prev.valor, 0) /
        periodos.length

    if (newState.media) {
        if (newState.media >= 7) {
            newState.situacao = "Aprovado"
            newState.exame.valor = "--"
        } else {
            newState.situacao = "Exame"
            let exame = 0
            if (periodos.length > 2) {
                exame =
                    (50 -
                        1.5 *
                            (periodos[0].valor +
                                periodos[1].valor +
                                periodos[2].valor +
                                periodos[3].valor)) /
                        4 +
                    0.04
                console.log("exame", exame)
                newState.exame.valor = parseFloat(exame.toFixed(1))
            } else {
                exame =
                    (50 - 3 * (periodos[0].valor + periodos[1].valor)) / 4 +
                    0.04
                console.log("exame", exame)
                newState.exame.valor = parseFloat(exame.toFixed(1))
            }
        }
    } else {
        newState.exame.valor = ""
        newState.media = 0
    }

    return { ...newState, periodos }
}

export function notasReducer(
    state: IReducerState,
    action: {
        type: "LOAD_NOTAS" | "UPDATE_PERIODO" | "UPDATE_EXAME"
        payload?: any
    }
) {
    const newState = { ...state }

    switch (action.type) {
        case "LOAD_NOTAS":
            return updateMedia(action.payload, [...action.payload.periodos])

        case "UPDATE_PERIODO":
            const newPeriodos = newState.periodos.map((p) => {
                if (p.id === action.payload.id) {
                    p.valor = Number(action.payload.valor)
                }
                return p
            })
            return updateMedia(newState, newPeriodos)

        case "UPDATE_EXAME":
            return newState
    }

    return newState
}
