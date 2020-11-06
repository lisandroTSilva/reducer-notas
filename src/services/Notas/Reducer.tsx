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
    valor: number
}

export interface IReducerState {
    periodos: IPeriodo[]
    exame: IExame
    media: number
    situacao: string
}

function updateMedia(newState: IReducerState, periodos: IPeriodo[]) {
    const total = periodos.reduce((prev, cur) => prev + cur.valor, 0)

    newState.media = total / periodos.length

    const multiplicador = periodos.length > 2 ? 1.5 : 3
    const calculoExame = (50 - multiplicador * total) / 4 + 0.04

    let aprovadoComExame = false
    if (newState.exame.fechado && newState.exame.valor >= calculoExame) {
        aprovadoComExame = true
    }

    if (newState.media >= 7 || aprovadoComExame) {
        newState.situacao = "Aprovado"
        newState.exame.valor = 0
    } else {
        if (newState.exame.fechado || calculoExame > 10) {
            newState.situacao = "Reprovado"
            newState.exame.valor = calculoExame
        } else {
            newState.situacao = "Exame"
            newState.exame.valor = calculoExame
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
            return updateMedia({ ...action.payload }, [
                ...action.payload.periodos
            ])

        case "UPDATE_PERIODO":
            const newPeriodos = newState.periodos.map((p) => {
                if (p.id === action.payload.id) {
                    p.valor = Number(action.payload.valor)
                }
                return p
            })
            return updateMedia({ ...newState }, newPeriodos)

        // case "UPDATE_EXAME":
        // return updateMedia(
        //     { ...newState, mostraExame: true },
        //     newState.periodos,
        //     action.payload
        // )
        // newState.exame.valor = action.payload
        // if (newState.exame.valor > newState.exame.minimo) {
        //     newState.situacao = "Aprovado"
        // } else {
        //     newState.situacao = "Reprovado"
        // }

        // const notasFixas = newState.periodos.reduce(
        //     (prev, cur) => (cur.fechado ? prev + cur.valor : prev),
        //     0
        // )

        // const multiplicador = newState.periodos.length > 2 ? 1.5 : 3

        // const quantoFalta =
        //     (newState.exame.valor * (4 + 0.04) - 50) / (multiplicador * -1)

        // const qtdFechadas = newState.periodos.reduce(
        //     (prev, cur) => (cur.fechado ? prev + 1 : prev),
        //     0
        // )

        // console.log("qtdAbertas", newState.periodos.length - qtdFechadas)
        // console.log("Notas fixas: ", notasFixas)
        // console.log("Quanto Falta: ", (quantoFalta - notasFixas) / 2)

        // return { ...newState }
    }

    return newState
}
