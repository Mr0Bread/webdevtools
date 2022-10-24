import React, { FC } from 'react';
import { InferGetServerSidePropsType } from "next";
import { Dropdown, Menu, Table } from "antd";
import { prisma } from 'src/server/db/client'

const UsersPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  users
                                                                               }) => {
    return (
      <Table
      expandable={{
        expandedRowRender: (record) => {
          return (
            <Table
              columns={[
                {
                  title: 'ID',
                  dataIndex: 'id',
                },
                {
                  title: 'Title',
                  dataIndex: 'title',
                }
              ]}
              dataSource={ record.applications }
            /> 
          )
        }
      }}
        columns={[
          {
            title: 'ID',
            dataIndex: 'id',
          },
          {
            title: 'Email',
            dataIndex: 'email',
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
                        label: 'Edit',
                      },
                      {
                        key: 'delete',
                        title: 'Delete',
                        label: 'Delete',
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
        dataSource={users}
      />
  );
}

export const getServerSideProps = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      applications: {
        select: {
          id: true,
          title: true,
        }
      }
    }
  })

  return {
    props: {
      users
    }
  }
}

export default UsersPage;
