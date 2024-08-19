import { Loader2, type LucideProps } from 'lucide-react';
import { css } from 'styled-system/css';

export const Loader = (props: LucideProps) => {
  return (
    <Loader2
      {...props}
      className={css({
        animation: 'spin',
        animationName: 'spin',
      })}
    />
  );
};
