export const INITIAL_STATE = {
    periodos: [],
    exame: {
        fechado: false,
        valor: 0
    },
    mostraExame: false,
    media: 0,
    situacao: ""
}

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
    mostraExame: boolean
    situacao: string
}

function updateMedia(
    newState: IReducerState,
    periodos: IPeriodo[],
    exame: number | null = null
) {
    const total = periodos.reduce((prev, cur) => prev + cur.valor, 0)

    newState.media = total / periodos.length

    newState.exame.valor = ""

    if (newState.media >= 7) {
        newState.situacao = "Aprovado"
        newState.exame.valor = "--"
    } else {
        newState.situacao = "Exame"

        // @TODO Verificar essa lógica
        const multiplicador = periodos.length > 2 ? 1.5 : 3

        if (exame === null) {
            exame = (50 - multiplicador * total) / 4 + 0.04
        }

        newState.exame.valor = Number(exame)
        newState.media = (total + newState.exame.valor) / (periodos.length + 1)

        if (newState.media >= 5) {
            newState.situacao = "Aprovado"
        }
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
            return updateMedia({ ...action.payload, mostraExame: false }, [
                ...action.payload.periodos
            ])

        case "UPDATE_PERIODO":
            const newPeriodos = newState.periodos.map((p) => {
                if (p.id === action.payload.id) {
                    p.valor = Number(action.payload.valor)
                }
                return p
            })
            return updateMedia({ ...newState, mostraExame: true }, newPeriodos)

        case "UPDATE_EXAME":
            return updateMedia(
                { ...newState, mostraExame: true },
                newState.periodos,
                action.payload
            )
    }

    return newState
}
