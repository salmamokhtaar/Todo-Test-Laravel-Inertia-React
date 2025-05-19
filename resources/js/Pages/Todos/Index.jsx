import { useState } from 'react';
import { useForm } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

export default function Index({ todos }) {
  const [editingTodoId, setEditingTodoId] = useState(null);

  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    description: ''
  });

  const submit = e => {
    e.preventDefault();

    if (editingTodoId) {
      // Update existing todo
      put(`/todos/${editingTodoId}`, {
        onSuccess: () => {
          reset();
          setEditingTodoId(null);
        }
      });
    } else {
      // Create new todo
      post('/todos', {
        onSuccess: () => reset()
      });
    }
  };

  const deleteTodo = id => {
    Inertia.delete(`/todos/${id}`);
  };

  const viewTodo = (todo) => {
    alert(`Title: ${todo.title}\nDescription: ${todo.description || 'No description'}`);
  };

  const editTodo = (todo) => {
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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      <form onSubmit={submit} className="flex flex-col gap-2 mb-4">
        <input
          className="border px-3 py-2"
          placeholder="Add new task..."
          value={data.title}
          onChange={e => setData('title', e.target.value)}
        />
        <textarea
          className="border px-3 py-2"
          placeholder="Description (optional)"
          value={data.description}
          onChange={e => setData('description', e.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={processing || !data.title.trim()}
          >
            {editingTodoId ? 'Update' : 'Add'}
          </button>
          {editingTodoId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {errors.title && <div className="text-red-500">{errors.title}</div>}
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex justify-between items-start border-b py-2">
            <div>
              <h3 className="font-semibold">{todo.title}</h3>
              {todo.description && <p className="text-sm text-gray-500">{todo.description}</p>}
            </div>
            <div className="flex flex-col gap-1 text-right">
              <button onClick={() => viewTodo(todo)} className="text-blue-500 text-xs">View</button>
              <button onClick={() => editTodo(todo)} className="text-green-500 text-xs">Edit</button>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-500 text-xs">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
