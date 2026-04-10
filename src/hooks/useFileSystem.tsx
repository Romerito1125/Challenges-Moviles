import { useState } from "react";
import {
    Filesystem,
    Directory,
    Encoding,
} from "@capacitor/filesystem";

export const useFilesystem = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const writeFile = async ({
        path,
        data,
        directory = Directory.Documents,
        isJson = true,
    }: any) => {
        try {
            setLoading(true);

            const content = isJson ? JSON.stringify(data) : data;

            await Filesystem.writeFile({
                path,
                data: content,
                directory,
                encoding: Encoding.UTF8,
            });

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const readFile = async ({
        path,
        directory = Directory.Documents,
        isJson = true,
    }: any) => {
        try {
            setLoading(true);

            const result = await Filesystem.readFile({
                path,
                directory,
                encoding: Encoding.UTF8,
            });

            return isJson ? JSON.parse(result.data as string) : result.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteFile = async ({
        path,
        directory = Directory.Documents,
    }: any) => {
        try {
            setLoading(true);

            await Filesystem.deleteFile({
                path,
                directory,
            });

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const listFiles = async ({
        path = "",
        directory = Directory.Documents,
    }: any) => {
        try {
            setLoading(true);

            const result = await Filesystem.readdir({
                path,
                directory,
            });

            return result.files;
        } catch (err) {
            setError(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createDir = async ({
        path,
        directory = Directory.Documents,
    }: any) => {
        try {
            setLoading(true);

            await Filesystem.mkdir({
                path,
                directory,
                recursive: true,
            });

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const deleteDir = async ({
        path,
        directory = Directory.Documents,
        recursive = true,
    }: any) => {
        try {
            setLoading(true);

            await Filesystem.rmdir({
                path,
                directory,
                recursive,
            });

            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        writeFile,
        readFile,
        deleteFile,
        listFiles,
        createDir,
        deleteDir,
    };
};
