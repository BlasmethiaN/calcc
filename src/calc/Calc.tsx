import React, { useMemo, useState } from 'react'

import styled from 'styled-components'

// <Wrap>
//  <h1>Pozadí</h1>
// </Wrap>
const Wrap = ({ children }: { children: React.ReactNode }) => (
  <div style={{ backgroundColor: 'red' }}>{children}</div>
)

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
}) => {
  return (
    <Td onClick={() => onDigitClick(digit)} colSpan={colSpan}>
      {digit}
    </Td>
  )
}

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
  const [a, setA] = useState<number | null>(null)
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
        if (Math.log10(a) <= 8) setA(a * 10 + digit)
      } else {
        setA(digit)
      }
    }
  }

  const clear = () => {
    setA(null)
    setB(null)
    setOperator(null)
    setResult(null)
  }

  return (
    <Table>
      <tr>
        <Td noHover colSpan={3}>
          {result ? result : `${a ?? ''} ${operator?.char ?? ''} ${b ?? ''}`}
        </Td>
      </tr>
      <tr>
        <DigitButton digit={7} onDigitClick={typeNumber} />
        <DigitButton digit={8} onDigitClick={typeNumber} />
        <DigitButton digit={9} onDigitClick={typeNumber} />
      </tr>
      <tr>
        <DigitButton digit={4} onDigitClick={typeNumber} />
        <DigitButton digit={5} onDigitClick={typeNumber} />
        <DigitButton digit={6} onDigitClick={typeNumber} />
      </tr>
      <tr>
        <DigitButton digit={1} onDigitClick={typeNumber} />
        <DigitButton digit={2} onDigitClick={typeNumber} />
        <DigitButton digit={3} onDigitClick={typeNumber} />
      </tr>
      <tr>
        <DigitButton digit={0} onDigitClick={typeNumber} colSpan={2} />
        <Td onClick={clear}>CLR</Td>
      </tr>
    </Table>
  )
}

export default Calc
