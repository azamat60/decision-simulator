import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SavedViewsPanel } from '../components/SavedViewsPanel'
import type { SavedView } from '../domain/types'

const sampleViews: SavedView[] = [
  {
    id: 'v1',
    name: 'My Finance View',
    simulator: 'finance',
    params: {
      initialAmount: 10000,
      monthlyContribution: 500,
      years: 10,
      annualReturnRate: 8,
      inflationRate: 2,
      showInflationAdjusted: true
    },
    createdAt: '2026-02-13T00:00:00.000Z',
    updatedAt: '2026-02-13T00:00:00.000Z'
  }
]

describe('SavedViewsPanel', () => {
  it('imports JSON and calls onImport', async () => {
    const user = userEvent.setup()
    const onImport = vi.fn()

    render(
      <SavedViewsPanel
        views={sampleViews}
        onLoad={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onImport={onImport}
      />
    )

    fireEvent.change(screen.getByPlaceholderText(/Paste saved views JSON/i), {
      target: { value: JSON.stringify(sampleViews) }
    })
    await user.click(screen.getByRole('button', { name: /Import JSON/i }))

    expect(onImport).toHaveBeenCalledTimes(1)
    expect(onImport).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'v1' })]))
  })

  it('exports JSON on click', async () => {
    const user = userEvent.setup()
    const createUrlSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    render(
      <SavedViewsPanel
        views={sampleViews}
        onLoad={vi.fn()}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onImport={vi.fn()}
      />
    )

    await user.click(screen.getByRole('button', { name: /Export JSON/i }))

    expect(createUrlSpy).toHaveBeenCalledTimes(1)
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(revokeSpy).toHaveBeenCalledWith('blob:test')

    createUrlSpy.mockRestore()
    revokeSpy.mockRestore()
    clickSpy.mockRestore()
  })
})
