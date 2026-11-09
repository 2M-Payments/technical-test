import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { RegionSelector } from '../components/users/RegionSelector';
import { regionsFixture } from './fixtures';

describe('<RegionSelector />', () => {
  it('permite adicionar mais de uma região', async () => {
    const onChange = vi.fn();
    render(<RegionSelector regions={regionsFixture} value={['BR']} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Reino Unido'));

    expect(onChange).toHaveBeenCalledWith(['BR', 'GB']);
  });

  it('remove uma região já selecionada', async () => {
    const onChange = vi.fn();
    render(<RegionSelector regions={regionsFixture} value={['BR', 'GB']} onChange={onChange} />);

    expect(screen.getByLabelText('Brasil')).toBeChecked();
    await userEvent.click(screen.getByLabelText('Brasil'));

    expect(onChange).toHaveBeenCalledWith(['GB']);
  });
});
