"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { JSONContent } from "@tiptap/react";

// 自定义 TextStyle 扩展，允许 `fontSize`
const FontSizeExtension = TextStyle.extend({
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export default function Editor({ entryId, categoryId }: { entryId: number; categoryId: number }) {
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [2] }), // 支持标题
      FontSizeExtension, // ✅ 允许修改字号
      Color, // ✅ 允许修改颜色
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "w-full prose p-4 border rounded-lg min-h-[200px] focus:outline-none max-h-[600px] overflow-auto"
      },
    },
  });

  useEffect(() => {
  const fetchEntry = async () => {
    const res = await fetch(`/api/entries/${categoryId}/${entryId}`);
    const data = await res.json();
    const content = data.content || {};
    setInitialContent(content);
    if (editor) {
      editor.commands.setContent(content); // 显式设置内容
    }
    };
    fetchEntry();
}, [entryId, categoryId, editor]);

    const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    setMessage("");

    const contentJSON = editor.getJSON();

    try {
      const response = await fetch(`/api/entries/${categoryId}/${entryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contentJSON }),
      });

      if (response.ok) {
        setMessage("保存成功！");
        router.refresh();
      } else {
        setMessage("保存失败");
      }
    } catch (error) {
      console.error(error);
      setMessage("网络错误");
    }

    setSaving(false);
  };

  if (!editor) return null;
    // 设置文本颜色
    const setTextColor = (color: string) => {
      editor.chain().focus().setMark("textStyle", { color }).run();
    };
    
    // 切换加粗
    const toggleBold = () => {
      editor.chain().focus().toggleBold().run();
    };

  return (
    <>
    <div className="w-full max-w-full mx-1 mt-2">
      {/* 按钮组 */}
      <div className="mb-2 flex gap-1">
        <button
          className="px-3 py-1 bg-gray-700 text-white rounded-lg text-sm"
          onClick={() => {editor.chain().focus().toggleHeading({ level: 2 }).setMark("textStyle", { fontSize: "24px",color:"#000000"}).setMark("bold").run();}}>
          标题
        </button>
        <button 
          className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm" 
          onClick={() => {editor.chain().focus().setMark("textStyle", { fontSize: "18px", color: "#000000" }).unsetMark("bold").run()}}>
          正文
        </button>
        <button 
          className="px-3 py-1 bg-gray-300 text-white rounded-lg text-sm" 
          onClick={() => {editor.chain().focus().setMark("textStyle", { fontSize: "12px", color: "#888888" }).unsetMark("bold").run()}}>
          附注
        </button>

        {/* 加粗 */}

        <button
          className="px-3 py-1 bg-black text-white rounded-lg text-sm"
          onClick={toggleBold}
        >
          加粗
        </button>

        {/* 颜色选择 */}

        <button
          className="px-3 py-1 bg-red-500 rounded-lg"
          onClick={() => setTextColor("#ef4444")}
        >
        </button>

        <button
          className="px-3 py-1 bg-orange-500 rounded-lg"
          onClick={() => setTextColor("#f97316")}
        >
        </button>

        <button
          className="px-3 py-1 bg-yellow-500 rounded-lg"
          onClick={() => setTextColor("#eab308")}
        >
        </button>

        <button
          className="px-3 py-1 bg-green-500 rounded-lg"
          onClick={() => setTextColor("#22c55e")}
        >
        </button>

        <button
          className="px-3 py-1 bg-blue-500 rounded-lg"
          onClick={() => setTextColor("#3b82f6")}
        >
        </button>

        <button
          className="px-3 py-1 bg-purple-500 rounded-lg"
          onClick={() => setTextColor("#a855f7")}
        >
        </button>
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded-lg"
          onClick={handleSave}
          disabled={saving}
        >
        {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {/* 编辑器 */}

      {initialContent === null ? (
        <div className="w-auto min-h-225 max-h-700 prose p-4 border rounded-lg">
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      ) : (
        <EditorContent editor={editor} className="w-auto min-h-225 max-h-450" />
      )}

      {/* 提示信息 */}
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
    </>
  );
}
