import { FC } from "react";
import { Typography } from 'antd'
import CategoryForm from "src/forms/category";
import { prisma } from 'src/server/db/client'
import { InferGetServerSidePropsType } from "next";
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";

const { Title } = Typography

const NewCategoryPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
    categories
}) => {
    const router = useRouter()
    const {
        mutate: createCategory,
        isLoading,
    } = trpc.useMutation(
        'category.create',
        {
            onSuccess: () => {
                router.push('/categories')
            }
        }
    )

    return (
        <>
            <Title
                level={2}
            >
                New Category
            </Title>
            <CategoryForm
                categories={categories}
                category={{
                    name: '',
                    title: '',
                    urlKey: '',
                    parentId: null,
                }}
                isLoading={isLoading}
                onSubmit={(values) => createCategory({
                    name: values.name,
                    title: values.title,
                    urlKey: values.urlKey || undefined,
                    parentId: values.parentId || undefined,
                })}
            />
        </>
    )
}

export const getServerSideProps = async () => {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        }
    })

    return {
        props: {
            categories
        }
    }
}

export default NewCategoryPage