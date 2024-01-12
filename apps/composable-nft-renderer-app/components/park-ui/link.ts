import { ark } from '@ark-ui/react/factory';
import { type HTMLStyledProps, styled } from 'styled-system/jsx';
import { link } from 'styled-system/recipes';

export const Link = styled(ark.a, link);
export interface LinkProps extends HTMLStyledProps<typeof Link> {}
