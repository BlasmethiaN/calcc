import React, { useMemo, useReducer, useState } from 'react'

import { produce } from 'immer'
import styled from 'styled-components'

// <Wrap>
//  <h1>Pozadí</h1>
// </Wrap>
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'red' }}>{children}</div>
)

type Action =
  | {
      type: 'typeDigit'
      digit: Digit
    }
  | {
      type: 'typeOperator'
      operator: Operator
    }
  | { type: 'compute' }
  | { type: 'clear' }

type CalcState = {
  a: number
  operator: Operator | null
  b: number | null
  result: number | null
}

// state je stav calccu
// action je provedená akce, např. napsané číslo, = nebo operátor
const calcReducer: React.Reducer<CalcState, Action> = (state, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case 'typeDigit': {
        const digit = action.digit

        if (draft.result) {
          draft.result = null
          draft.operator = null
          draft.b = null
        }

        const { a, b, operator, result } = draft
        if (operator != null) {
          if (b) {
            if (Math.log10(b) <= 8) draft.b = b * 10 + digit
          } else {
            draft.b = digit
          }
        } else {
          if (a) {
            if (result) draft.result = null
            if (Math.log10(a) <= 8) draft.a = a * 10 + digit
          } else {
            draft.a = digit
          }
        }
        break
      }
      case 'typeOperator': {
        const { result } = draft
        if (result) {
          draft.a = result
          draft.b = null
        }
        draft.result = null
        draft.operator = action.operator
        break
      }
      case 'compute': {
        const { operator } = draft
        if (operator != null) {
          if (draft.b == null) draft.b = draft.a
          const { a, b, operator, result } = draft
          draft.result = operator!.compute(result ?? a, b!)
          draft.a = 0
        }
        break
      }
      case 'clear': {
        draft.a = 0
        draft.operator = null
        draft.b = null
        draft.result = null
        break
      }
    }

    console.log(JSON.stringify(draft))
  })
}

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

class Operator {
  private constructor(readonly char: string, readonly compute: (a: number, b: number) => number) {}

  static readonly add = new Operator('+', (a, b) => a + b)
  static readonly subtract = new Operator('-', (a, b) => a - b)
  static readonly multiply = new Operator('*', (a, b) => a * b)
  static readonly divide = new Operator('/', (a, b) => a / b)
}

const DigitButton = ({
  digit,
  colSpan,
  onDigitClick,
}: {
  digit: Digit
  colSpan?: number
  onDigitClick: (digit: Digit) => void
}) => (
  <Td onClick={() => onDigitClick(digit)} colSpan={colSpan}>
    {digit}
  </Td>
)

const OperatorButton = ({
  operator,
  onOperatorClick,
}: {
  operator: Operator
  onOperatorClick: (operator: Operator) => void
}) => <Td onClick={() => onOperatorClick(operator)}>{operator.char}</Td>

// styled(component)
const Td = styled.td<{ noHover?: boolean }>`
  width: 50px;
  height: 50px;
  font-size: 20px;
  color: #000;
  background-color: #ff85c0;
  text-align: center;
  border: 1px solid black;
  border-radius: 3px;
  transition: 0.1s;

  ${({ noHover }) =>
    !noHover &&
    `
      user-select: none;
      cursor: pointer;
      `}

  &:hover {
    ${({ noHover }) => !noHover && `background-color: #f759ab;`}
  }
`

// & placeholder pro tag
// styled.tag
const Table = styled.table`
  &,
  & tr,
  & td {
    border-collapse: separate;
    border-spacing: 5px;
  }
`

const Calc = () => {
  const [{ a, operator, b, result }, dispatch] = useReducer(calcReducer, { a: 0 } as CalcState)

  const typeNumber = (digit: Digit) => {
    dispatch({ type: 'typeDigit', digit })
  }
  const typeOperator = (operator: Operator) => {
    dispatch({ type: 'typeOperator', operator })
  }
  const compute = () => dispatch({ type: 'compute' })
  const clear = () => dispatch({ type: 'clear' })

  const display = useMemo(() => {
    if (result != null) return result
    let display = '' + a
    if (operator != null) display += operator.char
    if (b) display += b
    return display
  }, [a, operator, b, result])

  return (
    <Table>
      <tbody>
        <tr>
          <Td noHover colSpan={4}>
            {display}
          </Td>
        </tr>
        <tr>
          <DigitButton digit={7} onDigitClick={typeNumber} />
          <DigitButton digit={8} onDigitClick={typeNumber} />
          <DigitButton digit={9} onDigitClick={typeNumber} />
          <OperatorButton operator={Operator.add} onOperatorClick={typeOperator} />
        </tr>
        <tr>
          <DigitButton digit={4} onDigitClick={typeNumber} />
          <DigitButton digit={5} onDigitClick={typeNumber} />
          <DigitButton digit={6} onDigitClick={typeNumber} />
          <OperatorButton operator={Operator.subtract} onOperatorClick={typeOperator} />
        </tr>
        <tr>
          <DigitButton digit={1} onDigitClick={typeNumber} />
          <DigitButton digit={2} onDigitClick={typeNumber} />
          <DigitButton digit={3} onDigitClick={typeNumber} />
          <OperatorButton operator={Operator.multiply} onOperatorClick={typeOperator} />
        </tr>
        <tr>
          <Td onClick={clear}>CLR</Td>
          <DigitButton digit={0} onDigitClick={typeNumber} colSpan={1} />
          <Td onClick={compute}>=</Td>
          <OperatorButton operator={Operator.divide} onOperatorClick={typeOperator} />
        </tr>
      </tbody>
    </Table>
  )
}

export default Calc
