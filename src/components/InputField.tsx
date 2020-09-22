import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldsProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  name: string;
  label: string;
  textarea?: boolean;
  resize?: 'horizontal' | 'vertical' | 'none';
};

function InputField({ label, textarea, resize, ...props }: InputFieldsProps) {
  const [field, meta] = useField(props);
  const InputOrTextarea = textarea ? Textarea : Input;

  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} resize={resize} id={field.name} />
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
