import { useRef, useState } from "react";
import { duplicateRegenerateSortArray } from "../../utils/cards-utils";
import { Card, CardProps } from "../Card";
import "./styles.css"

export interface GridProps {
    cards: CardProps[]
}

export function Grid({ cards }: GridProps) {
    const [stateCards, setStateCards] = useState(() => {
        return duplicateRegenerateSortArray(cards)
    })
    const first = useRef<CardProps | null>(null)
    const second = useRef<CardProps | null>(null)
    const unflip = useRef(false)
    const [matches, setMatches] = useState(0)
    const [moves, setMoves] = useState(0)

    const handleReset = () => {
        setStateCards(duplicateRegenerateSortArray(cards))
        first.current = null
        second.current = null
        unflip.current = false
        setMatches(0)
        setMoves(0)
    }

    const handleClick = (id: string) => {
        const newStateCards = stateCards.map((card) => {
            //Se o id do cartao nao for o id clicado, nao faz nada
            if (card.id != id) return card
            //se o cartao ja estiver virado, nao faz nada
            if (card.flipped) return card

            //desviro possiveis cartas erradas
            if (unflip.current && first.current && second.current) {
                first.current.flipped = false
                second.current.flipped = false
                first.current = null
                second.current = null
                unflip.current = false
            }

            //virar o card
            card.flipped = true

            //configura primeiro e segunda card clicado
            if (first.current === null) {
                first.current = card
            } else if (second.current === null) {
                second.current = card
            }

            //se e tenho os dois card virado
            //posso checar se estao corretos
            if (first.current && second.current) {
                if (first.current.back === second.current.back) {
                    //a pessoa acertou
                    first.current = null
                    second.current = null
                    setMatches((m) => m + 1)
                } else {
                    // a pessoa errou
                    unflip.current = true
                }

                setMoves((m) => m + 1)
            }

            return card
        })

        setStateCards(newStateCards)
    }

    return (
        <>
            <div className="text">
                <h1>Memory Game</h1>
                <p>Moves: {moves} | Matches: {matches}
                    <button onClick={handleReset}>Reset</button></p>
            </div>
            <div className="grid">
                {stateCards.map((card) => {
                    return <Card
                        {...card}
                        key={card.id}
                        handleClick={handleClick} />
                })}
            </div>
        </>
    )
}