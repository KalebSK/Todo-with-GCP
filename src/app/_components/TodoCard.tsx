"use client";

import { useState } from "react";

export type Priority = "high" | "medium" | "low";

export interface TodoCardProps {
    id: string;
    desc: string;
    prio: Priority;
    synced: boolean; 
    remove: (id: string, rem: boolean) => void;
}

export default function TodoCard({ id ,desc, prio, remove }: TodoCardProps) {
    const [selected, setSelected] = useState(false);
    let bgClass;
    if (prio === "high") {
        if(selected) {
            bgClass = "p-3 flex justify-center bg-slate-900/40 ring-sky-500 rounded ring-2";
        } else {
            bgClass = "p-3 flex justify-center bg-slate-900/40 ring-red-600 rounded ring-1";
        }
    } else if (prio === "medium") {
        if(selected) {
            bgClass = "p-3 flex justify-center bg-slate-900/40 ring-sky-500 rounded ring-2";
        } else {
             bgClass = "p-3 flex justify-center bg-slate-900/40 ring-green-600 rounded ring-1";
        }
    } else {
        if(selected) {
            bgClass = "p-3 flex justify-center bg-slate-900/40 ring-sky-500 rounded ring-2";
        } else {
            bgClass = "p-3 flex justify-center bg-slate-900/40 ring-yellow-600 rounded ring-1";
        }
    }
    return (
        <button
            className={bgClass}
            onClick={(e) => {
                setSelected(prev => !prev);
                remove(id, !selected);
            }}
        >
            <span className="text-white text-sm">{desc}</span>
        </button>
    );
}
