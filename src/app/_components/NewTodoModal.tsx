'use client'
import { type TodoCardProps } from "./TodoCard";
import { Priority } from "./TodoCard";
import { useState } from "react";
interface NewTodoModalProps {
    addTodo: (newTodo: Omit<TodoCardProps, "id" | "remove" | "synced">) => void;
    closeModal: () => void;
}

export default function NewTodoModal({addTodo, closeModal} : NewTodoModalProps) {
    const [todoInput, setTodoInput]  = useState({desc: '', prio: "high" as Priority});
    function updatePrioSelect(newPrio: Priority)  {
        setTodoInput({...todoInput, prio: newPrio});
    }
    return (
        <div className="rounded-2xl text-lg p-4 flex flex-col gap-2 justify-center">
            <input
                onChange={(e) => {
                    setTodoInput({ ...todoInput, desc: e.target.value });
                }}
                placeholder="todo description"
                className="bg-slate-900/20 ring-1 ring-gray-400/60 text-gray-50 p-2 rounded-2xl"
            ></input>
            <select
                onChange={(e) => {
                    if(e.target.value === "high" || e.target.value === "medium" || e.target.value === "low") {
                        updatePrioSelect(e.target.value);
                    }
                }}
                className="bg-slate-900/20 ring-1 ring-gray-400/60 rounded-2xl w-36 p-2 text-lg"
            >
                <option value={"high"}>High</option>
                <option value={"medium"}>Medium</option>
                <option value={"low"}>Low</option>
            </select>
            <div className="flex gap-2 justify-center">
            <button
                onClick={() => {
                    addTodo(todoInput);
                }}
                className="bg-slate-800/20 text-slate-400 text-lg rounded-lg w-24 p-1 ring-1 ring-slate-400/20"
            >Add</button>
            <button
                onClick={() => {
                    closeModal();
                }}
                className="bg-slate-800/20 text-slate-400 text-lg rounded-lg w-24 p-1 ring-1 ring-slate-400/20"
            >Done</button>


            </div>
        </div>
    );
}