"use client";
import TodoCard from "./_components/TodoCard";
import { useState } from "react";
import { TodoCardProps } from "./_components/TodoCard";
import NewTodoModal from "./_components/NewTodoModal";
import type { TokenResponseData } from "./api/auth/route";
import { apiUrls } from "@/_utils/api";
import useLocalStorage from "@/_utils/useLocalStorage";
import useGoogleTasks from "@/_utils/useGoogleTasks";
import { MdCloudSync } from "react-icons/md";
import Spinner from "./_components/Spinner";

type Todos = TodoCardProps[];

interface SyncResponseBody {
    message: string;
    data: string;
}

export default function Todos() {
    const todos = useLocalStorage<TodoCardProps>("todos");
    const gTask = useGoogleTasks(syncTodos);
    let toRemove = [] as TodoCardProps[];

    const [shwTodoBox, setShwTodoBox] = useState(false);
    let todosList;
    if (todos) {
        todosList = todos.items.map((todo) => {
            return (
                <TodoCard
                    key={todo.id}
                    id={todo.id}
                    desc={todo.desc}
                    prio={todo.prio}
                    remove={removeTodo}
                    synced={todo.synced}
                ></TodoCard>
            );
        });
    }

    async function syncTodos(tokens: TokenResponseData) {
        let yetToSyncRemoved = [];
        if (localStorage.getItem("toremove")) {
            yetToSyncRemoved = JSON.parse(localStorage.getItem("toremove")!);
        }
        console.log("yet to be removed ", yetToSyncRemoved);
        const reqRemove = [...toRemove, ...yetToSyncRemoved].map((curr) => ({
            id: curr.id,
            prio: curr.prio,
            desc: curr.desc,
            synced: curr.synced,
        }));
        console.log("ready to be removed ", reqRemove);
        const reqInit: RequestInit = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${tokens.access_token}`,
            },
            body: JSON.stringify({
                tasks: todos.items,
                toRemove: reqRemove,
            }),
        };
        const syncResult = await fetch(apiUrls.taskList.syncTaskList, reqInit);
        if (syncResult.status === 200) {
            const syncBody: SyncResponseBody = await syncResult.json();
            const newTodos: TodoCardProps[] = JSON.parse(syncBody.data).map(
                (curr: Omit<TodoCardProps, "remove">) => {
                    return { ...curr, remove: removeTodo };
                }
            );
            todos.replace(newTodos);
        } else {
            console.error(
                `error with gcloud sync ${syncResult.status}: ${
                    (await syncResult.json()).message
                }`
            );
        }
    }
    // add or remove todos from toRemove array based on if it is selected by the user or not
    function removeTodo(id: string, rem: boolean) {
        if (rem) {
            const remove = todos.items.find((todo) => todo.id === id);
            if (remove) {
                toRemove.push(remove);
            }
        } else {
            toRemove = toRemove.filter((curr) => curr.id !== id);
        }
    }

    function addTodo(props: Omit<TodoCardProps, "id" | "remove" | "synced">) {
        todos.addItem({
            id: crypto.randomUUID(),
            remove: removeTodo,
            synced: false,
            ...props,
        });
    }

    function isEmpty() {
        return (
            <span className="self-center text-sm text-slate-300/40">
                {"you have no todos :)"}
            </span>
        );
    }

    return (
        <>
            {
                <div className="flex p-1 gap-3 flex-col rounded w-72 bg-gradient-to-t from-slate-800 to-slate-800 ring-1 ring-slate-500">
                    {todos.loading
                        ? Spinner({ size: 10, color: "slate" })
                        : todosList!.length === 0
                        ? isEmpty()
                        : todosList}
                    {shwTodoBox && (
                        <div className="rounded-2xl bg-slate-900/50">
                            <NewTodoModal
                                addTodo={addTodo}
                                closeModal={() => setShwTodoBox(false)}
                            ></NewTodoModal>
                        </div>
                    )}
                </div>
            }
            <div className="flex gap-4 justify-evenly">
                <button
                    onClick={() => {
                        setShwTodoBox(true);
                    }}
                    className="text-sm w-16 h-7 text-slate-400 rounded bg-slate-800/20 ring-1 ring-slate-800"
                >
                    Add
                </button>
                <button
                    onClick={() => {
                        gTask();
                        todos.setLoading(true);
                    }}
                    className="rounded-full bg-slate-600/20 border border-slate-600 p-1"
                >
                    <MdCloudSync className="fill-slate-400 p-1"></MdCloudSync>
                </button>
                <button
                    onClick={() => todos.removeItem(toRemove)}
                    className="text-sm w-16 h-7 text-slate-400 rounded bg-slate-800/20 ring-1 ring-slate-800"
                >
                    Remove
                </button>
            </div>
        </>
    );
}
