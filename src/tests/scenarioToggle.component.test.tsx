import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { getFinanceDefaults } from '../domain/finance'
import { FinanceSimulator } from '../features/finance/FinanceSimulator'

const Wrapper = () => {
  const [compare, setCompare] = useState(false)

  return (
    <FinanceSimulator
      input={getFinanceDefaults()}
      compareScenarios={compare}
      onUpdate={() => undefined}
      onToggleCompare={setCompare}
      onReset={() => undefined}
      onSave={() => undefined}
    />
  )
}

describe('Scenario compare toggle', () => {
  it('shows scenario cards when compare is enabled', async () => {
    const user = userEvent.setup()
    render(<Wrapper />)

    expect(screen.getByText(/CAGR approx/i)).toBeInTheDocument()

    await user.click(screen.getByRole('switch', { name: /compare scenarios/i }))

    expect(screen.getByText(/conservative/i, { selector: 'div' })).toBeInTheDocument()
    expect(screen.getByText(/optimistic/i, { selector: 'div' })).toBeInTheDocument()
    expect(screen.queryByText(/CAGR approx/i)).not.toBeInTheDocument()
  })
})
