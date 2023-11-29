interface spinnerProps {
    size: keyof typeof sizes;
    color: keyof typeof colors;
}
const sizes = {
    1: "w-1 h-1",
    2: "w-2 h-2",
    3: "w-3 h-3",
    4: "w-4 h-4",
    5: "w-5 h-5",
    6: "w-6 h-6",
    7: "w-7 h-7",
    8: "w-8 h-8",
    9: "w-9 h-9",
    10: "w-10 h-10",
    11: "w-11 h-11",
    12: "w-12 h-12",
    16: "w-16 h-16",
    20: "w-20 h-20",
}
const colors = {
    purple: ["border-purple-500","border-r-purple-500/20"],
    blue: ["border-blue-500", "border-r-blue-500/20"],
    green: ["border-green-500", "border-r-green-500/20"],
    slate: ["border-slate-500", "border-r-slate-500/20"],
}

export default function Spinner({ size, color }: spinnerProps) {
    let clr = colors[color];
    let sz = sizes[size];
    const cls = `${clr[0]} ${clr[1]} rounded-full bg-transparent border-4 ${sz} animate-spin self-center`;
    return <span className={cls}></span>;
}
