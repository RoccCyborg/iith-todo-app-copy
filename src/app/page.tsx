"use client";
import { unstable_noStore as noStore } from "next/cache";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  noStore();
  return (
    <main className="flex min-h-screen">
      <div className="container gap-12 px-4 py-16 ">
        <div>
          <h1 className="text-center text-3xl">Todo Application</h1>
          <div className="m-20 w-full">
            <NewTodo />
            <div className="mt-5  p-2">
              <TodoItems />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const NewTodo = () => {
  const utils = api.useUtils();
  const [text, setText] = useState("");

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTodo.mutate({ text, status: false });
    setText("");
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text "
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-md border-2 p-2"
          placeholder="Type your todo"
        />
        <button className="my-2 rounded-lg bg-gray-200 p-2 px-4">
          Add Task
        </button>
      </form>
    </>
  );
};

const TodoItems = () => {
  const utils = api.useUtils();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const todoData = api.todo.getAll.useQuery();
  const { data: todos = [] } = todoData;

  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const updateTodo = api.todo.update.useMutation({
    onSuccess: async () => {
      await utils.todo.getAll.invalidate();
    },
  });

  const handleDelete = (id: number) => {
    deleteTodo.mutate({ id });
  };

  const handleUpdate = (id: number, text: string) => {
    updateTodo.mutate({ id, text });
    setEditingTodoId(null);
  };
  return (
    <div>
      {todos.map((item) => (
        <div
          key={item.id}
          className="my-4 flex justify-between bg-gray-200 p-2"
        >
          {editingTodoId === item.id ? (
            <TodoEditForm item={item} onUpdate={handleUpdate} />
          ) : (
            <div className="flex w-full justify-between">
              <p className="text-lg">{item.text}</p>
              <div className="flex gap-4">
                <button onClick={() => setEditingTodoId(item.id)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TodoEditForm = ({
  item,
  onUpdate,
}: {
  item: { id: number; text: string };
  onUpdate: (id: number, text: string) => void;
}) => {
  const { id, text } = item;
  const [newText, setNewText] = useState(text);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(id, newText);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="mx-2 rounded-md p-2"
        type="text"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
};
