import React, { FC, useState } from 'react';
import { InferGetServerSidePropsType } from "next";
import { prisma } from 'src/server/db/client'
import { Table, Dropdown, Menu, Button, Popconfirm, Space, Tree } from "antd";
import type { DataNode } from 'antd/lib/tree'; 
import Link from 'next/link';
import { trpc } from 'src/utils/trpc';

const CategoriesPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  categories,
}) => {
  const [categoryList, setCategoryList] = useState(categories)
  const {
    refetch: queryCategories,
  } = trpc.useQuery(['categories.all'], {
    enabled: false,
    onSuccess: (data) => {
      setCategoryList(data)
    }
  })
  const {
    mutate: deleteCategory,
    isLoading: isDeleting,
  } = trpc.useMutation(
    'category.delete',
    {
      onSuccess: () => queryCategories()
    }
  )

  return (
    <Space
      direction='vertical'
      style={{
        width: '100%'
      }}
    >
      <Link
        passHref
        href="/categories/new"
      >
        <Button
          type='primary'
        >
          Add New
        </Button>
      </Link>
      <Table
        loading={isDeleting}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: 'Title',
            dataIndex: 'title',
          },
          {
            title: 'Name',
            dataIndex: 'name',
          },
          {
            title: 'URL Key',
            dataIndex: 'urlKey',
          },
          {
            title: 'Parent Category Name',
            dataIndex: ['parent', 'name']
          },
          {
            key: 'Actions',
            title: 'Actions',
            render: (_, record) => (
              <Dropdown
                overlay={
                  <Menu
                    items={[
                      {
                        key: 'edit',
                        title: 'Edit',
                        label: (
                          <Link
                            passHref
                            href={`/categories/${record.id}`}
                          >
                            <Button
                              style={{
                                width: '100%',
                              }}
                            >
                              Edit
                            </Button>
                          </Link>
                        ),
                      },
                      {
                        key: 'delete',
                        title: 'Delete',
                        label: (
                          <Popconfirm
                            title="Are you sure to delete this category?"
                            onConfirm={() => deleteCategory({
                              id: record.id
                            })}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button
                              danger
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        ),
                      }
                    ]}
                  />
                }
                trigger={['click']}
              >
                <a onClick={e => e.preventDefault()}>
                  Actions
                </a>
              </Dropdown>
            )
          }
        ]}
        dataSource={categoryList}
      />
    </Space>
  );
}

export const getServerSideProps = async () => {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
      name: true,
      urlKey: true,
      parent: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })

  if (!categories.length) {
    return {
      props: {
        categories
      }
    }
  }

  const rootCategory = categories.find(category => !category.parent)

  if (!rootCategory) {
    return {
      props: {
        categories
      }
    }
  }

  const tree: DataNode[] = [
    {
      key: rootCategory.id,
      title: rootCategory.title,
    }
  ]
  // Implement building tree of categories
  // let currentRef = tree[0]
  // const categoryQueue = [rootCategory]
  // let currentCategory: typeof rootCategory;

  // while (categoryQueue.length) {
  //   currentCategory = categoryQueue.pop() as typeof rootCategory

  //   if (!currentCategory) {
  //     throw new Error('Category is undefined')
  //   }

  //   if (currentCategory.parent) {
  //     currentRef = currentRef
  //       .children
  //       ?.find(({ key }) => key === currentCategory.id ) as DataNode
  //   }
    
  //   const children = categories.filter(category => category.parent?.id === currentCategory.id)

  //   if (children.length) {
  //     currentRef.children = children
  //       .map(({ id, title }) => ({
  //         key: id,
  //         title,
  //       }))
  //     categoryQueue.push(...children)

  //     continue
  //   }
  // }

  return {
    props: {
      categories
    }
  }
}

export default CategoriesPage;
