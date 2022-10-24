import React, { FC } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
  InputLeftAddon,
  InputGroup
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { NewApplication } from "src/server/router/protected-applications-router";
import Select from "src/components/select";

export type FormValues = {
  title: string;
  description: string;
  type: NewApplication['type'];
  category: string;
  price: string;
  image?: string;
}

export type ApplicationFormProps = {
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: FormValues;
  isLoading?: boolean;
  categories: {
    id: string;
    title: string;
  }[];
}

const ApplicationForm: FC<ApplicationFormProps> = ({
                                                     onSubmit,
                                                     initialValues,
                                                     isLoading,
                                                     categories
                                                   }) => {
  const {
    handleSubmit,
    register,
    formState: {
      errors,
      isSubmitting,
    },
    control
  } = useForm<FormValues>({
    defaultValues: initialValues,
  })

  return (
    <form
      onSubmit={ handleSubmit((values) => onSubmit(values)) }
    >
      <VStack
        alignItems="flex-start"
        spacing={ 4 }
      >
        <FormControl
          isInvalid={ !!errors.category }
          isDisabled={ isLoading || isSubmitting }
        >
          <FormLabel>
            Category
          </FormLabel>
          <Controller
            name="category"
            control={ control }
            rules={{
              required: 'Category is required',
            }}
            render={ ({ field: { onChange, value } }) => (
              <Select
                options={
                  !!categories && !!categories.length
                    ? categories
                      .map(
                        ({ title, id }) => ({
                          value: id,
                          label: title,
                        })
                      )
                    : []
                }
                onChange={ (value) => {
                  onChange(value?.value)
                } }
                defaultInputValue={ value }
              />
            ) }
          />
          <FormErrorMessage>
            { errors.category && errors.category.message as string }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={ !!errors.title }
          isDisabled={ isLoading || isSubmitting }
        >
          <FormLabel
            htmlFor="title"
          >
            Title
          </FormLabel>
          <Input
            id="title"
            placeholder="Title"
            {
              ...register("title", {
                required: "Title is required",
                minLength: {
                  value: 8,
                  message: 'Minimum length should be 8'
                }
              })
            }
          />
          <FormErrorMessage>
            { errors.title && errors.title.message as string }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={ !!errors.description }
          isDisabled={ isLoading || isSubmitting }
        >
          <FormLabel
            htmlFor="description"
          >
            Description
          </FormLabel>
          <Textarea
            id="description"
            placeholder="Description"
            {
              ...register('description', {
                required: 'Description is required',
              })
            }
          />
          <FormErrorMessage>
            { errors.description && errors.description.message as string }
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={ isLoading || isSubmitting }
        >
          <FormLabel
            htmlFor="image"
          >
            Image
          </FormLabel>
          <Input
            id="image"
            placeholder="Image URL"
            {
              ...register("image")
            }
          />
        </FormControl>
        <Box>
          <Controller
            name="type"
            control={ control }
            rules={ {
              required: 'Type is required',
            } }
            render={ ({ field: { onChange, value } }) => (
              <>
                <FormControl
                  isInvalid={ !!errors.type }
                  isDisabled={ isLoading || isSubmitting }
                >
                  <FormLabel>
                    Type of application
                  </FormLabel>
                  <RadioGroup
                    onChange={ onChange }
                    value={ value }
                  >
                    <Stack>
                      <Radio
                        value="BUY"
                      >
                        Buy
                      </Radio>
                      <Radio
                        value="SELL"
                      >
                        Sell
                      </Radio>
                      <Radio
                        value="RENT"
                      >
                        Rent
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <FormErrorMessage>
                    { errors.type && errors.type.message as string }
                  </FormErrorMessage>
                </FormControl>
              </>
            ) }
          />
        </Box>
        <FormControl
          isDisabled={ isLoading || isSubmitting }
          >
          <FormLabel
            htmlFor="price"
            >
            Price
          </FormLabel>
          <InputGroup>
            <InputLeftAddon>
              $
            </InputLeftAddon>
            <Input
              id="price"
              placeholder="Price"
              type='number'
              {
                ...register("price")
              }
            />
          </InputGroup>
        </FormControl>
      </VStack>
      <Button
        mt={ 4 }
        isLoading={ isLoading || isSubmitting }
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
}

export default ApplicationForm;
