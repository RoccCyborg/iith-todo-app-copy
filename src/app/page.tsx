"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

interface TodoProps {
  todos: RouterOutputs["todo"]["getTodos"];
}

function Todos({ todos }: TodoProps) {
  const utils = api.useUtils();

  const mutation = api.todo.deleteTodo.useMutation();

  const handleDelete = async (id: number) => {
    await mutation.mutateAsync({ id: id });
    await utils.todo.getTodos.invalidate();
  };

  return (
    <div>
      {todos.map((todo) => {
        return (
          <div key={todo.id} className="flex justify-between p-1">
            <div>{todo.text}</div>
            <button
              className="bg-gray-300 p-1"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const utils = api.useUtils();
  const [text, setText] = useState("");

  const todosQuery = api.todo.getTodos.useQuery();

  const mutation = api.todo.createTodo.useMutation();

  const handleAdd = async () => {
    console.log("Add TODO");
    console.log(text);
    await mutation.mutateAsync({ text: text });
    setText("");
    await utils.todo.getTodos.invalidate();
  };

  return (
    <main className="flex min-h-screen">
      <div className="container gap-12 px-4 py-16 ">
        <div>
          <h1 className="text-center text-3xl">Todo Application</h1>
        </div>
        <div>
          <input
            type="text"
            className="m-2 w-full rounded border p-2"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <button className="rounded bg-gray-200 p-2" onClick={handleAdd}>
            Add Task
          </button>
        </div>
        <div>{todosQuery.data ? <Todos todos={todosQuery.data} /> : null}</div>
      </div>
    </main>
  );
}
