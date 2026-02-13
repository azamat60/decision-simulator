import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { getFinanceDefaults } from '../domain/finance'
import type { FinanceInputParams } from '../domain/types'
import { FinanceSimulator } from '../features/finance/FinanceSimulator'

const Wrapper = () => {
  const [input, setInput] = useState<FinanceInputParams>(getFinanceDefaults())

  return (
    <FinanceSimulator
      input={input}
      compareScenarios={false}
      onUpdate={(patch) => setInput((prev) => ({ ...prev, ...patch }))}
      onToggleCompare={() => undefined}
      onReset={() => setInput(getFinanceDefaults())}
      onSave={() => undefined}
    />
  )
}

describe('FinanceSimulator UI', () => {
  it('updates summary when input changes', async () => {
    const user = userEvent.setup()
    render(<Wrapper />)

    const before = screen.getByText(/Final value/i).parentElement?.textContent
    const input = screen.getByRole('spinbutton', { name: /Monthly contribution/i })

    await user.clear(input)
    await user.type(input, '1000')

    const after = screen.getByText(/Final value/i).parentElement?.textContent
    expect(after).not.toEqual(before)
  })
})
