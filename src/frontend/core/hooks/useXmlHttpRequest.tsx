import { useEffect, useState } from "react";

export const useXmlHttpRequest = (options: {url: string, method?: "GET" | "POST", body?: string}) => {
    const [data, setData] = useState({
        loading: true,
        items: [], 
        error: false
    });

    useEffect(() => {
        setData({ ...data, error: null, loading: true });
        fetch(options.url, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XmlHttpRequest"
            },
            body: options.method !== "GET" && options.body,
        })
            .then(async (response) => {
                const data = await response.json();
                setData({
                    items: data.items,
                    error: !response.ok,
                    loading: false,
                });
            })
            .catch((error) => {
                setData({
                    items: [],//{ status: "network_failure" },
                    error: true,
                    loading: false,
                });
            });
    }, [JSON.stringify(options)]);

    return data;
}