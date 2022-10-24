import { Box, Button, VStack } from "@chakra-ui/react"
import { GetServerSidePropsContext } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import CategoryService from "src/server/services/category-service"
import type { AsyncReturnType } from 'type-fest'

const CategoriesPage: FC<AsyncReturnType<typeof getStaticProps>['props']> = ({
    categories,
}) => {
    const router = useRouter()
    return (
        <VStack
            alignItems='flex-start'
        >
            {
                categories
                    .map(({ title, id, _count: { applications }, urlKey }) => (
                        <Link
                            key={id}
                            passHref
                            href={`${router.asPath}/${urlKey}`}
                        >
                            <Button>
                                <Box
                                    me={2}
                                >
                                    {title}
                                </Box>
                                <Box
                                    color="gray.500"
                                >
                                    ({applications})
                                </Box>
                            </Button>
                        </Link>
                    ))
            }
        </VStack>
    )
}

export const getStaticProps = async (ctx: GetServerSidePropsContext<{ slug: string[] }>) => {
    const {
        params
    } = ctx

    const {
        slug: slugArray
    } = params as { slug: string[] }
    const slug = `/${slugArray.join('/')}`
    const categories = await CategoryService.getChildrenCategoriesBySlug(slug)

    return {
        props: {
            categories,
        }
    }
}

export const getStaticPaths = async () => {
    const paths = await CategoryService.getCategoriesStaticPaths()

    return {
        paths,
        fallback: 'blocking',
    }
}

export default CategoriesPage