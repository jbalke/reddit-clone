import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldsProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

function InputField({ label, size: _, ...props }: InputFieldsProps) {
  const [field, meta] = useField(props);

  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Input {...field} {...props} id={field.name} />
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
