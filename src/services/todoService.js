import baseService from './_baseService'

export const addTask = async (payload) => {
  const result = await baseService.post('/tasks', payload)
  return result
}

export const getTasks = async () => {
  const result = await baseService.get('/tasks')
  return result
}

export const updateTask = async (id, payload) => {
  const result = await baseService.put(`tasks/${id}`, payload)
  return result
}

export const deleteTask = async (id) => {
  const result = await baseService.delete(`tasks/${id}`)
  return result
}