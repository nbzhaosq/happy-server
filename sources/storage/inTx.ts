import { Prisma } from "@prisma/client";
import { db } from "@/storage/db";

export type Tx = Prisma.TransactionClient;

const symbol = Symbol();

export function afterTx(tx: Tx, callback: () => void) {
    let callbacks = (tx as any)[symbol] as (() => void)[];
    callbacks.push(callback);
}

export async function inTx<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
    let wrapped = async (tx: Tx) => {
        (tx as any)[symbol] = [];
        let result = await fn(tx);
        let callbacks = (tx as any)[symbol] as (() => void)[];
        return { result, callbacks };
    }
    let result = await db.$transaction(wrapped);
    for (let callback of result.callbacks) {
        try {
            callback();
        } catch (e) {
            console.error(e);
        }
    }
    return result.result;
}