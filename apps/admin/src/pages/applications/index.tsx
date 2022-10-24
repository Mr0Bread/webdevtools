import { InferGetServerSidePropsType } from 'next'
import React, { FC } from 'react'
import { prisma } from 'src/server/db/client'
import { Dropdown, Menu, Table } from 'antd'

const ApplicationsPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
                                                                                        applications,
                                                                                      }) => {
  return (
    <>
      <Table
        columns={ [
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: 'Title',
            dataIndex: 'title',
          },
          {
            title: 'Type',
            dataIndex: 'type',
          },
          {
            title: 'User Email',
            dataIndex: ['user', 'email'],
          },
          {
            title: 'Category Title',
            dataIndex: ['category', 'title'],
          },
          {
            key: 'Actions',
            title: 'Actions',
            render: (_, record) => (
              <Dropdown
                overlay={
                  <Menu
                    items={ [
                      {
                        key: 'delete',
                        title: 'Delete',
                        label: 'Delete',
                      }
                    ] }
                  />
                }
                trigger={ ['click'] }
                arrow
              >
                <a onClick={ e => e.preventDefault() }>
                  Actions
                </a>
              </Dropdown>
            )
          }
        ] }
        dataSource={ applications }
      />
    </>
  )
}

export const getServerSideProps = async () => {
  const applications = await prisma.application.findMany({
    select: {
      id: true,
      title: true,
      type: true,
      user: {
        select: {
          email: true,
        }
      },
      category: {
        select: {
          title: true,
        }
      }
    }
  })

  return {
    props: {
      applications
    }
  }
}

export default ApplicationsPage
