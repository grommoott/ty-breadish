import { ReactNode } from "react";

export default function Button({ content }: { content: ReactNode }) {
    return <button className="bg-amber-500 p-4 m-2 rounded">{content}</button >
}
