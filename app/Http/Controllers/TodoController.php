<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoController extends Controller
{
    public function index()
    {
        $todos = auth()->user()->todos()->latest()->get();
        return Inertia::render('Todos/Index', ['todos' => $todos]);
    }

    public function store(Request $request)
    {
       $request->validate([
    'title' => 'required',
    'description' => 'nullable|string'
]);

auth()->user()->todos()->create($request->only('title', 'description'));

        return redirect()->route('todos.index');
    }

  public function update(Request $request, Todo $todo)
{
    $request->validate([
        'title' => 'required',
        'description' => 'nullable|string'
    ]);

    $todo->update([
        'title' => $request->title,
        'description' => $request->description,
    ]);

    return redirect()->route('todos.index');
}


    public function destroy(Todo $todo)
    {
        $todo->delete();
        return redirect()->route('todos.index');
    }
}
