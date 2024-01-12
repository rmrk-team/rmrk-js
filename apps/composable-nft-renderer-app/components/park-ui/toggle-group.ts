'use client';

import { ToggleGroup as ArkToggleGroup } from '@ark-ui/react/toggle-group';
import { createStyleContext } from 'lib/panda/create-style-context';
import { type HTMLStyledProps, styled } from 'styled-system/jsx';
import { toggleGroup } from 'styled-system/recipes';

const { withProvider, withContext } = createStyleContext(toggleGroup);

const ToggleGroup = withProvider(styled(ArkToggleGroup.Root), 'root');
const ToggleGroupItem = withContext(styled(ArkToggleGroup.Item), 'item');

const Root = ToggleGroup;
const Item = ToggleGroupItem;

export { Item, Root, ToggleGroup, ToggleGroupItem };

export interface ToggleGroupProps extends HTMLStyledProps<typeof ToggleGroup> {}
export interface ToggleGroupItemProps
  extends HTMLStyledProps<typeof ToggleGroupItem> {}
