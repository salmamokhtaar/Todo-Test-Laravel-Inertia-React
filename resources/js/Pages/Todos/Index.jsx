import { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ todos }) {
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    description: ''
  });

  const submit = e => {
    e.preventDefault();
    if (editingTodoId) {
      put(`/todos/${editingTodoId}`, {
        onSuccess: () => {
          reset();
          setEditingTodoId(null);
        }
      });
    } else {
      post('/todos', { onSuccess: () => reset() });
    }
  };

  const deleteTodo = id => Inertia.delete(`/todos/${id}`);

  const viewTodo = todo => {
    alert(`Title: ${todo.title}\nDescription: ${todo.description || 'No description'}`);
  };

  const editTodo = todo => {
    setData({
      title: todo.title,
      description: todo.description || ''
    });
    setEditingTodoId(todo.id);
  };

  const cancelEdit = () => {
    reset();
    setEditingTodoId(null);
  };

  const toggleComplete = todo => {
    Inertia.put(`/todos/${todo.id}`, {
      title: todo.title,
      description: todo.description,
      completed: !todo.completed
    });
  };

  const filteredTodos = todos.filter(todo => {
    if (statusFilter === 'completed') return todo.completed;
    if (statusFilter === 'pending') return !todo.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">📝 My To-Do List</h1>

      {/* Filter */}
      <div className="flex justify-center gap-4 mb-6">
        {['all', 'completed', 'pending'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1 rounded-full text-sm transition-all duration-200 ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6 space-y-3">
        <input
          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-200 outline-none"
          placeholder="Task title..."
          value={data.title}
          onChange={e => setData('title', e.target.value)}
        />
        <textarea
          className="w-full px-4 py-2 border rounded focus:ring focus:ring-blue-200 outline-none"
          placeholder="Task description (optional)"
          value={data.description}
          onChange={e => setData('description', e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            disabled={processing || !data.title.trim()}
          >
            {editingTodoId ? 'Update Task' : 'Add Task'}
          </button>
          {editingTodoId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
        {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
      </form>

      {/* Todo List */}
      <ul className="space-y-4">
        {filteredTodos.length === 0 ? (
          <p className="text-gray-500 text-center">No tasks to show.</p>
        ) : (
          filteredTodos.map(todo => (
            <li
              key={todo.id}
              className="flex items-start justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow"
            >
              <div className="flex items-start gap-3 w-full">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="mt-1 accent-blue-600"
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-gray-500">{todo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button onClick={() => viewTodo(todo)} className="text-xs text-blue-500 hover:underline">View</button>
                <button onClick={() => editTodo(todo)} className="text-xs text-green-500 hover:underline">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
