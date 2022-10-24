import React, { FC, useEffect, useState } from 'react';
import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import {
  Badge,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  SimpleGrid,
  VStack,
  Text,
  HStack
} from "@chakra-ui/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import CategoryService from 'src/server/services/category-service';
import Select from 'src/components/select';

export type FilterFormValues = {
  type?: [
    'BUY',
    'SELL',
    'RENT',
  ]
}

const ApplicationsPage: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  applications,
  slug
}) => {
  const {
    handleSubmit,
    register,
    reset,
  } = useForm<FilterFormValues>()
  const [filters, setFilters] = useState<FilterFormValues>({})
  const [sort, setSort] = useState<{ field: string, order: 'asc' | 'desc' } | undefined>(undefined)
  const [applicationList, setApplicationList] = useState(applications)
  const [areFiltersActive, setAreFiltersActive] = useState(false)

  useEffect(() => {
    setAreFiltersActive(
      !!Object
        .values(filters)
        .filter(value => !!value)
        .length
    )
  }, [filters])

  trpc.useQuery(
    ['applications.get', {
      filter: filters,
      sort,
      category: {
        slug
      }
    }],
    {
      onSuccess: (data) => {
        setApplicationList(data)
      }
    }
  )
  const onSubmit = (values: FilterFormValues) => {
    setFilters({
      type: !values.type || !values.type.length ? undefined : values.type
    })
  }
  const onSortChange = (option: { value: string, label: string } | null) => {

    if (!option) {
      return;
    }
    const { value } = option

    const [field, order] = value.split(':')

    if (order !== 'asc' && order !== 'desc') {
      return;
    }

    setSort({
      field,
      order
    })
  }

  return (
    <Grid
      templateColumns="25% auto"
      templateAreas={`
      "filterTitle sort"
      "filters applications"
      `}
      columnGap={8}
    >
      <GridItem
        area="filterTitle"
      >
        <Heading
          size="md"
          mb={5}
        >
          FILTERS
        </Heading>
      </GridItem>
      <GridItem
        area="filters"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <VStack
            gap={4}
            alignItems="flex-start"
          >
            <FormControl>
              <FormLabel>
                Type
              </FormLabel>
              <VStack
                alignItems="flex-start"
              >
                <Checkbox
                  value="BUY"
                  {
                  ...register('type')
                  }
                >
                  Buy
                </Checkbox>
                <Checkbox
                  value="SELL"
                  {
                  ...register('type')
                  }
                >
                  Sell
                </Checkbox>
                <Checkbox
                  value="RENT"
                  {
                  ...register('type')
                  }
                >
                  Rent
                </Checkbox>
              </VStack>
            </FormControl>
            <Button
              type="submit"
              w="100%"
            >
              APPLY
            </Button>
            {
              areFiltersActive && (
                <Button
                  colorScheme="red"
                  w="100%"
                  onClick={() => {
                    reset({})
                    setFilters({})
                  }}
                >
                  RESET
                </Button>
              )
            }
          </VStack>
        </form>
      </GridItem>
      <GridItem
        area="sort"
      >
        <HStack
          mb={4}
          maxW="auto"
        >
          <Text>
            Sort by
          </Text>
          <Select
            options={[
              {
                label: 'Price, Low to High',
                value: 'price:asc'
              },
              {
                label: 'Price, High to Low',
                value: 'price:desc'
              }
            ]}
            onChange={onSortChange}
          />
        </HStack>
      </GridItem>
      <GridItem
        area="applications"
      >
        <SimpleGrid
          columns={3}
          templateRows="repeat(3, 1fr)"
          gap={6}
        >
          {
            applicationList
              .map(({
                title,
                id,
                image,
                type
              }) => (
                <Link
                  href={`/application/${id}`}
                  passHref
                  key={id}
                >
                  <Box
                    border="1px solid"
                    borderColor="gray"
                    shadow="dark-lg"
                    borderRadius={6}
                    _hover={{
                      cursor: 'pointer',
                      borderColor: 'gray.500'
                    }}
                    position="relative"
                    overflow="hidden"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                  >
                    <Badge
                      position="absolute"
                      bgColor="gray.800"
                      p={1}
                      left={2}
                      top={2}
                    >
                      {type}
                    </Badge>
                    {
                      image ? (
                        <img
                          src={image}
                          width="auto"
                          height="100%"
                        />
                      ) : (
                        <Box
                          height="100%"
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <div>
                            Image not found
                          </div>
                        </Box>
                      )
                    }
                    <Box
                      p={4}
                    >
                      {title}
                    </Box>
                  </Box>
                </Link>
              ))
          }
        </SimpleGrid>
      </GridItem>
    </Grid>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext<{ slug: string[] }>) => {
  const {
    params
  } = context

  if (!params) {
    return {
      props: {
        applications: [],
        slug: ''
      }
    }
  }

  const {
    slug: slugArr,
  } = params
  const slug = `/${slugArr.join('/')}`;

  const applications = await CategoryService.getApplicationsByCategorySlug(
    slug
  )

  return {
    props: {
      applications,
      slug
    },
  };
}

export const getStaticPaths = async () => {
  const paths = await CategoryService.getCategoriesStaticPaths()

  return {
    paths,
    fallback: true,
  }
}

export default ApplicationsPage;
