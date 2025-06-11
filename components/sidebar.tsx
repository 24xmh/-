"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Entry {
  id: number;
  title: string;
}

interface Category {
  id: number;
  name: string;
  entries: Entry[];
}

export default function Sidebar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [creatingType, setCreatingType] = useState<"category" | "entry">();
  const [newName, setNewName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();

  const handleSubmit = async () => {
    if (!newName.trim()) return;
  
    try {
      // 根据创建类型构造API路径和请求体
      const apiPath = creatingType === 'category' 
        ? '/api/categories/' 
        : '/api/entries/';
      
      const requestBody = creatingType === 'category'
        ? { name: newName.trim() }
        : {
            title: newName.trim(),
            categoryId: selectedCategoryId,
            content: {
              type: "doc",
              content: [
                { type: "paragraph" }
              ]
              }
          };
  
      // 发送POST请求
      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 处理成功响应
      const createdData = await response.json();
      router.refresh(); // 刷新服务端数据
      
      if (creatingType === 'entry') {
        router.push(`/${selectedCategoryId}/${createdData.id}`); // 导航到新条目
        router.refresh(); // 刷新服务端数据
      }
      
      cancelCreating();
    } catch (error) {
      console.error('创建失败:', error);
      // 可以添加错误提示
    }
  };
  
  const handleDeleteEntry = async (entryId: number) => {
    try {
      const response = await fetch(`/api/entries`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ entryId }),  // 将 entryId 作为请求体传递
      });
  
      if (!response.ok) {
        throw new Error(`删除失败，状态码: ${response.status}`);
      }
      router.push("/"); // 删除后跳转到首页
      router.refresh(); // 重新加载数据
    } catch (error) {
      console.error("删除条目失败:", error);
    }
  };
  
  
  
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryId }),  // 将 categoryId 作为请求体传递
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `删除失败，状态码: ${response.status}`);
      }
  
      // 删除成功后重新加载数据
      router.refresh();
    } catch (error) {
      console.error("删除分类失败:", error);

      alert("请删除所有条目后再试!");
    }
  };
  

  const cancelCreating = () => {
    setCreatingType(undefined);
    setNewName("");
    setSelectedCategoryId(undefined);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200 text-xl font-semibold">
        笔记与日程
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <Link
          href="/"
          className={cn(
            "block px-3 py-2 rounded-md text-sm font-bold",
            pathname === "/" ? "bg-gray-100 text-blue-600" : "hover:bg-gray-100"
          )}
        >
          主页
        </Link>

        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex justify-between items-center group">
              <div className="px-3 py-2 text-sm font-bold text-gray-700">
              {category.name}
              </div>
              <div className="flex ml-auto space-x-2">
              <button
                onClick={() => handleDeleteCategory(category.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
              <button
                onClick={() => {
                setCreatingType("entry");
                setSelectedCategoryId(category.id);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
              >
                +
              </button>
              </div>
            </div>

            <div className="pl-4 space-y-1">
              {category.entries.map((entry) => {
              const isActive = pathname === `/${category.id}/${entry.id}`;

              return (
                <Link
                  key={entry.id}
                  href={`/${category.id}/${entry.id}`}
                  className={cn(
                    "px-3 py-1 text-sm flex justify-between items-center group hover:bg-gray-100 rounded-md",
                    isActive ? "bg-gray-100 text-blue-600" : "text-gray-600"
                  )}
                >
                {entry.title}
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                >
                ×
                </button>
                </Link>
                );
              })}

              {creatingType === "entry" && selectedCategoryId === category.id && (
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-1 py-1 text-sm border rounded"
                    placeholder="新条目名称"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit();
                      if (e.key === "Escape") cancelCreating();
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    className="p-1 rounded"
                  >
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600">
                    ✓
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="pt-4">
          {creatingType === "category" ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border rounded"
                placeholder="新分类名称"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                  if (e.key === "Escape") cancelCreating();
                }}
              />
              <button
                onClick={handleSubmit}
                className="p-1 rounded"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600">
                ✓
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCreatingType("category")}
              className="w-full px-3 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-1"
            >
              <span>+</span>
              <span>添加分类</span>
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}