import { ark } from '@ark-ui/react/factory';
import { type HTMLStyledProps, styled } from 'styled-system/jsx';
import { textarea } from 'styled-system/recipes';

export const Textarea = styled(ark.textarea, textarea);
export interface TextareaProps extends HTMLStyledProps<typeof Textarea> {}
