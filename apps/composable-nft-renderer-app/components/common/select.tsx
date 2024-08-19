import { CollectionItem, Portal } from '@ark-ui/react';
import {
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  type SelectProps,
  SelectTrigger,
  SelectValueText,
} from 'components/park-ui/select';
import { ChevronsUpDownIcon } from 'lucide-react';
import React, { ChangeEvent } from 'react';

type Option = { label: string; value: string; disabled?: boolean };

type Props = SelectProps & {
  items: Option[];
  label?: string;
  groupLabel?: string;
  id: string;
  placeholder: string;
};

export const InputSelect = ({
  label,
  groupLabel,
  id,
  placeholder,
  items,
  ...selectProps
}: Props) => {
  return (
    <Select {...selectProps} items={items} variant="outline">
      {label && <SelectLabel>{label}</SelectLabel>}

      <SelectControl>
        <SelectTrigger>
          <SelectValueText placeholder={placeholder} />
          <SelectIndicator>
            <ChevronsUpDownIcon />
          </SelectIndicator>
        </SelectTrigger>
      </SelectControl>
      <Portal>
        <SelectPositioner>
          <SelectContent>
            <SelectItemGroup id={id}>
              {groupLabel && (
                <SelectItemGroupLabel htmlFor={id}>
                  {groupLabel}
                </SelectItemGroupLabel>
              )}

              {items.map((item) => (
                <SelectItem key={item.value} item={item}>
                  <SelectItemText>{item.label}</SelectItemText>
                  <SelectItemIndicator>✓</SelectItemIndicator>
                </SelectItem>
              ))}
            </SelectItemGroup>
          </SelectContent>
        </SelectPositioner>
      </Portal>
    </Select>
  );
};
