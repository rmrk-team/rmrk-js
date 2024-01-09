import { CollectionItem, Portal } from '@ark-ui/react';
import { ChevronsUpDownIcon } from 'lucide-react';
import React, { ChangeEvent } from 'react';
import {
  Select,
  SelectLabel,
  SelectControl,
  SelectTrigger,
  SelectIndicator,
  SelectValueText,
  SelectPositioner,
  SelectContent,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectProps,
} from 'components/park-ui/select';

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
              {groupLabel && <SelectItemGroupLabel htmlFor={id}>{groupLabel}</SelectItemGroupLabel>}

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
