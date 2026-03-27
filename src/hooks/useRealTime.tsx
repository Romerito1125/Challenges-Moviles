import { useEffect, useState } from "react";
import { dbR } from "../firebase/config";
import { ref, get, push, set, remove, onValue } from "firebase/database";

const useRealtimeCollection = (table: string) => {

    const [results, setResults] = useState<any[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        setIsPending(true);

        const dbRef = ref(dbR, table);

        const unsubscribe = onValue(
            dbRef,
            (snapshot) => {
                if (snapshot.exists()) {

                    const data = Object.entries(snapshot.val() as any).map(
                        ([id, value]: [string, any]) => ({
                            id,
                            ...value
                        })
                    );

                    setResults(data);

                } else {
                    setResults([]);
                }

                setIsPending(false);

            },
            (err: any) => {
                setError(err.message);
                setIsPending(false);
            }
        );

        return () => unsubscribe();

    }, [table]);

    const getAll = async () => {
        setIsPending(true);
        setError(null);

        try {
            const snapshot = await get(ref(dbR, table));

            if (snapshot.exists()) {

                const data = Object.entries(snapshot.val() as any).map(
                    ([id, value]: [string, any]) => ({
                        id,
                        ...value
                    })
                );

                setResults(data);
            }

            setIsPending(false);

        } catch (error: any) {
            setError(error.message);
            setIsPending(false);
        }
    };

    const add = async (data: any) => {
        setIsPending(true);
        setError(null);

        try {
            const newRef = await push(ref(dbR, table), {
                ...data,
                createdAt: new Date().toISOString(),
            });

            setIsPending(false);
            return newRef;

        } catch (error: any) {
            setError(error.message);
            setIsPending(false);
            return null;
        }
    };

    const update = async (id: string, data: any) => {
        setIsPending(true);
        setError(null);

        try {
            await set(ref(dbR, `${table}/${id}`), {
                ...data,
                updatedAt: new Date().toISOString(),
            });

            setIsPending(false);
            return true;

        } catch (error: any) {
            setError(error.message);
            setIsPending(false);
            return false;
        }
    };

    const deleteDoc = async (id: string) => {
        setIsPending(true);
        setError(null);

        try {
            await remove(ref(dbR, `${table}/${id}`));

            setIsPending(false);
            return true;

        } catch (error: any) {
            setError(error.message);
            setIsPending(false);
            return false;
        }
    };

    return {
        results,
        isPending,
        error,
        getAll,
        add,
        update,
        deleteDoc
    };
};

export default useRealtimeCollection;
