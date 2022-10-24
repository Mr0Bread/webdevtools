import type { InferGetServerSidePropsType, NextPage } from "next";
import Head from "next/head";
import { prisma } from 'src/server/db/client'
import { Statistic, Card, Space } from 'antd'

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  applicationCount,
  userCount
}) => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Space
          direction="vertical"
          size="large"
        >
          <Card>
            <Statistic
              title="Applications"
              value={applicationCount}
            />
          </Card>
          <Card>
            <Statistic
              title="Registered Users"
              value={userCount}
            />
          </Card>
        </Space>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const applicationCount = await prisma.application.count()
  const userCount = await prisma.user.count()

  return {
    props: {
      applicationCount,
      userCount,
    }
  }
}

export default Home;
