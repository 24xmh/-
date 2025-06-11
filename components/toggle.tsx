"use client"

import { useState } from "react";
import Editor from "./editor";
import Viewer from "./viewer";

export default function Toggle({ entryId, categoryId }: { entryId: number; categoryId: number }) {
    const [mode, setMode] = useState<"edit" | "view">("view");
    
    return(
    <>
    <div>
        <button
          className="absolute top-6 right-[23rem] w-13 h-9 bg-amber-500 rounded-lg text-sm text-white flex items-center justify-center shadow-lg"
          onClick={() => setMode("edit")}
        >
          编辑
        </button>
        <button
          className="absolute top-6 right-[18rem] w-13 h-9 bg-blue-500 rounded-lg text-sm text-white flex items-center justify-center shadow-lg"
          onClick={() => setMode("view")}
        >
          阅览
        </button>
    </div>
    <div className="pt-2">
        {mode === "edit" ? (
          <Editor entryId={entryId} categoryId={categoryId} />
        ) : (
          <Viewer entryId={entryId} categoryId={categoryId} />
        )}
    </div>
    </>
    )
}
