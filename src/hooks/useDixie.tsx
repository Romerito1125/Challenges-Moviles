import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../dexie/config";

const useDexie = (table: string, filterFn: any = null) => {

    const [manualResults, setManualResults] = useState<any[]>([]);
    const [isPending, setIsPending] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    const liveResults = useLiveQuery(() => {
        if (filterFn) {
            return (db as any)[table].filter(filterFn).toArray();
        }
        return (db as any)[table].toArray();
    }, [table]) ?? [];

    const getAll = async () => {
        setIsPending(true);
        setError(null);

        try {
            let data: any[];

            if (filterFn) {
                data = await (db as any)[table].filter(filterFn).toArray();
            } else {
                data = await (db as any)[table].toArray();
            }

            setManualResults(data);
            setIsPending(false);

        } catch (err: any) {
            setError(err.message);
            setIsPending(false);
        }
    };

    const add = async (data: any) => {
        setIsPending(true);
        setError(null);

        try {
            await (db as any)[table].add({
                ...data,
                createdAt: new Date().toISOString(),
            });

            setIsPending(false);

        } catch (err: any) {
            setError(err.message);
            setIsPending(false);
        }
    };

    const update = async (id: any, data: any) => {
        setIsPending(true);
        setError(null);

        try {
            await (db as any)[table].update(id, data);
            setIsPending(false);

        } catch (err: any) {
            setError(err.message);
            setIsPending(false);
        }
    };

    const deleteItem = async (id: any) => {
        setIsPending(true);
        setError(null);

        try {
            await (db as any)[table].delete(id);
            setIsPending(false);

        } catch (err: any) {
            setError(err.message);
            setIsPending(false);
        }
    };

    return {
        liveResults,
        manualResults,
        isPending,
        error,
        getAll,
        add,
        update,
        deleteItem
    };
};

export default useDexie;
