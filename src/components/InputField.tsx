import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
  Textarea,
} from '@chakra-ui/core';
import { useField } from 'formik';
import React from 'react';

type InputFieldsProps = Omit<
  InputProps & InputProps<HTMLTextAreaElement>,
  'size'
> & {
  name: string;
  label: string;
  textarea?: boolean;
  resize?: 'horizontal' | 'vertical' | 'none';
  size?: 'sm' | 'md' | 'lg';
};

function InputField({
  label,
  textarea,
  resize,
  size,
  ...props
}: InputFieldsProps) {
  const [field, meta] = useField(props);
  const InputOrTextarea = textarea ? Textarea : Input;

  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        resize={resize}
        id={field.name}
        size={size}
      />
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
}

export default InputField;
