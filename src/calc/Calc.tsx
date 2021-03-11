import React, { useMemo, useState } from 'react'

import { produce } from 'immer'
import styled from 'styled-components'

// <Wrap>
//  <h1>Pozadí</h1>
// </Wrap>
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'red' }}>{children}</div>
)

enum ActionType {
  TYPE_NUMBER,
  TYPE_OPERATOR,
  COMPUTE,
}

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

type CalcState = {
  a: number
  operator: Operator | null
  b: number | null
  result: number | null
}

const reducer: React.Reducer<CalcState, Action> = (state, action) => {
  return produce(state, (draft) => {
    const { a, b, operator, result } = draft

    switch (action.type) {
      case 'typeDigit': {
        const digit = action.digit

        if (operator != null) {
          if (b != null) {
            if (Math.log10(b) <= 8) draft.b = b * 10 + digit
          } else {
            draft.b = digit
          }
        } else {
          if (a != null) {
            if (result) draft.result = null
            if (Math.log10(a) <= 8) draft.a = a * 10 + digit
          } else {
            draft.a = digit
          }
        }
        break
      }
      case 'typeOperator': {
        draft.operator = action.operator
        break
      }
      case 'compute': {
        if (operator != null) {
          const { a, b, operator, result } = draft
          draft.result = operator!.compute(result ?? a, result ?? b ?? a)
          draft.b = null
        }
        break
      }
    }
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
  user-select: none;
  cursor: pointer;
  border: 1px solid black;
  border-radius: 3px;
  transition: 0.1s;

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
  const [a, setA] = useState<number>(0)
  const [operator, setOperator] = useState<Operator | null>(null)
  const [b, setB] = useState<number | null>(null)
  const [result, setResult] = useState<number | null>(null)

  // 7, napíšu 8 => 78 (7 * 10 + 8)
  const typeNumber = (digit: Digit) => {
    if (operator != null) {
      if (b != null) {
        if (Math.log10(b) <= 8) setB(b * 10 + digit)
      } else {
        setB(digit)
      }
    } else {
      if (a != null) {
        if (result) setResult(null)
        if (Math.log10(a) <= 8) setA(a * 10 + digit)
      } else {
        setA(digit)
      }
    }
  }

  const typeOperator = (operator: Operator) => {
    setOperator(operator)
  }

  const clear = () => {
    setA(0)
    setB(null)
    setOperator(null)
    setResult(null)
  }

  const compute = () => {
    if (operator != null) {
      console.log({ a, b, operator, result })
      result && setA(() => result)
      setResult(operator.compute(a, b ?? a))
      setB(null)
    }
  }

  return (
    <Table>
      <tbody>
        <tr>
          <Td noHover colSpan={4}>
            {result ? result : `${a ?? ''} ${operator?.char ?? ''} ${b ?? ''}`}
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
