import { useState, useEffect } from "react";

export default function useLocalStorage<Type>(key: string) {
    const [items, setItems] = useState([] as Type[]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const item = localStorage.getItem(key);
        if (item) {
            setItems(JSON.parse(item));
            setIsLoading(false);
        }
    }, [key]);

    function handleAdd(val: Type) {
        setItems([...items, val]);
        console.log("item added");
        localStorage.setItem(key, JSON.stringify([...items, val]));
    }

    function handleRemove(toRemove: Type[]) {
        let newItems = items;
        toRemove.forEach((rem) => {
            newItems = newItems.filter((item) => item !== rem);
        });
        setItems([...newItems]);
        localStorage.setItem('toremove', JSON.stringify(toRemove));
        localStorage.setItem(key, JSON.stringify(newItems));
    }

    function replace(newList: Type[]) {
        setItems([...newList]);
        localStorage.setItem(key, JSON.stringify(newList));
        localStorage.setItem('remove', '');
        setIsLoading(false);
    }

    const itemProps = {
        items: items,
        addItem: handleAdd,
        removeItem: handleRemove,
        replace: replace,
        loading: isLoading,
        setLoading: setIsLoading
    };

    return itemProps;
}