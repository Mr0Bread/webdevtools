import { Form, Input, Select, Button, message } from 'antd'
import React, { FC } from 'react'

const { Option } = Select

export type FormValues = {
    name: string
    title: string
    urlKey: string | null
    parentId: string | null
}

const CategoryForm: FC<{
    category: FormValues,
    categories: {
        id: string,
        name: string,
    }[],
    onSubmit: (values: FormValues) => void,
    isLoading: boolean,
}> = ({
    category,
    categories,
    onSubmit,
    isLoading,
}) => {
        return (
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 16 }}
                initialValues={{
                    name: category.name,
                    title: category.title,
                    urlKey: category.urlKey,
                    parentId: category.parentId
                }}
                onFinish={onSubmit}
                disabled={isLoading}
                onFinishFailed={() => message.error('Please check the form')}
            >
                <Form.Item
                    label="Title"
                    name="title"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    required
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="URL Key"
                    name="urlKey"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Parent Category"
                    name="parentId"
                >
                    <Select
                        defaultValue={category.parentId}
                    >
                        {
                            categories
                                .map(({ id, name }) => (
                                    <Option
                                        key={id}
                                        value={id}
                                    >
                                        {name}
                                    </Option>
                                ))
                        }
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                    >
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        )
    }

export default CategoryForm
