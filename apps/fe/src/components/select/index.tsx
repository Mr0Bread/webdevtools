import React, { FC } from 'react';
import ReactSelect from 'react-select';
import { ArrayElement } from "type-fest/source/exact";

export type SelectProps = {
  options: {
    value: string;
    label: string;
  }[]
  onChange: (value: ArrayElement<SelectProps['options']> | null) => void;
  defaultInputValue?: string;
}

const Select: FC<SelectProps> = ({
                                   options,
                                   onChange,
                                   defaultInputValue
                                 }) => {
  return (
    <ReactSelect
      options={ options }
      onChange={ (newValue) => onChange(newValue) }
      defaultValue={
        !!defaultInputValue
          ? options.find(({ value }) => value === defaultInputValue)
          : undefined
      }
      placeholder={
        !!defaultInputValue
          ? options.find(({ value }) => value === defaultInputValue)?.label
          : undefined
      }
      styles={ {
        control: (provided) => ({
          ...provided,
          backgroundColor: 'none',
          borderColor: 'var(--chakra-colors-chakra-border-color)',
          ":hover": {
            borderColor: 'var(--chakra-colors-whiteAlpha-400)',
          }
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: 'none'
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isFocused ? 'var(--chakra-colors-gray-700)' : 'var(--chakra-colors-gray-800)'
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'var(--chakra-colors-gray-100)'
        }),
        input: (provided) => ({
          ...provided,
          color: 'var(--chakra-colors-gray-100)'
        }),
      } }
    />
  );
}

export default Select;
