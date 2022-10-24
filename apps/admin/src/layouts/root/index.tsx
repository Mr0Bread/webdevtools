import React, { FC, PropsWithChildren } from 'react';
import { Layout, Menu, Typography } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router';

const {
  Content,
  Footer,
  Header,
  Sider,
} = Layout
const {
  Title
} = Typography

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
      >
        <div
          style={{
            color: 'white',
            height: '60px',
            marginBottom: 0,
            textAlign: 'center'
          }}
        />
        <Menu
          theme='dark'
          mode='inline'
          items={[
            {
              key: '1',
              label: 'Dashboard',
              onClick: () => router.push('/'),
            },
            {
              key: '2',
              label: 'Applications',
              onClick: () => router.push('/applications'),
            },
            {
              key: '3',
              label: 'Categories',
              onClick: () => router.push('/categories'),
            },
            {
              key: '4',
              label: 'Users',
              onClick: () => router.push('/users'),
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header>
          <Title
            level={2}
            style={{
              color: 'white',
              marginBottom: 0,
            }}
          >
            Bargain
          </Title>
        </Header>
        <Content
          style={{
            padding: '24px'
          }}
        >
          {children}
        </Content>
        <Footer>
          Footer
        </Footer>
      </Layout>
    </Layout>
  );
}

export default RootLayout;
