import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldsProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

function InputField({ label, textarea, size: _, ...props }: InputFieldsProps) {
  const [field, meta] = useField(props);
  const InputOrTextarea = textarea ? Textarea : Input;

  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
