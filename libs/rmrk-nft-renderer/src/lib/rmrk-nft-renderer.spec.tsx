import { render } from '@testing-library/react';

import RmrkNftRenderer from './rmrk-nft-renderer';

describe('RmrkNftRenderer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RmrkNftRenderer />);
    expect(baseElement).toBeTruthy();
  });
});
