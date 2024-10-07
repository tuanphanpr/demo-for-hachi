import { useMemo, useState, useRef } from 'react'
import { Typography, Button, Checkbox, Form, Input, Flex, Radio, Popconfirm } from 'antd'
import { useEffect } from 'react'
import { DeleteFilled, QuestionCircleOutlined } from '@ant-design/icons';
import * as taskService from '../../services/todoService'
import styles from './TaskManagement.module.css'

const options = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Incomplete',
    value: 'incomplete',
  },
];

function TaskManagement() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState(localStorage.getItem('filter') ?? "")
  const inputRef = useRef(null)
  const [form] = Form.useForm();

  useEffect(() => {
    const getTasks = async () => {
      const result = await taskService.getTasks()
      const data = result?.data?.sort((a, b) => b.id - a.id)
      setTasks(data ?? [])
    }
    getTasks()
  }, [])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    if (filter === "incomplete") return !task.status
    if (filter === "completed") return task.status
    return true
  }), [filter, tasks])

  const onFinish = async (values) => {
    const result = await taskService.addTask(values)
    setTasks([result?.data, ...tasks])
    form.resetFields();
  }

  const handleFilter = async (e) => {
    const { value } = e.target
    setFilter(value)
    localStorage.setItem("filter", value)
  }

  const handleUpdateTask = async (id, e) => {
    const { checked } = e.target
    const result = await taskService.updateTask(id, { status: checked })

    if (result?.statusText === "OK" && result?.data) {
      const idx = tasks.findIndex(t => t.id === id)
      tasks[idx].status = checked
      setTasks([...tasks])
    }
  }

  const deleteTask= async (id) => {
    const result = await taskService.deleteTask(id)
    if (result?.statusText === "OK" && result?.data) {
      const idx = tasks.findIndex(t => t.id === id)
      tasks.splice(idx, 1)
      setTasks([...tasks])
    }
  };

  return (
    <div className={styles.container}>
      <Typography.Title level={1}>Task management</Typography.Title>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
      >
        <Form.Item
          style={{ flex: 1 }}
          name="taskname"
          rules={[
            {
              required: true,
              message: 'Please input taskname',
            },
          ]}
        >
          <Input ref={inputRef} />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
      <Flex vertical gap="middle" className={styles['status-radio-group']}>
        <Radio.Group
          block
          onChange={handleFilter}
          options={options}
          defaultValue={filter}
          optionType="button"
          buttonStyle="solid"
        />
      </Flex>

      <ul className={styles['task-list']}>
        {filteredTasks.map((task) => {
          return (
            <li key={task.id}>
              <Flex align='center' justify='space-between'>
                <Checkbox onChange={(payload) => handleUpdateTask(task.id, payload)} checked={task.status}>{task.taskname}</Checkbox>
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                  onConfirm={() => deleteTask(task.id)}
                >
                  <Button type="primary" danger size='small' shape="circle" icon={<DeleteFilled />} />
                </Popconfirm>
              </Flex>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TaskManagement
