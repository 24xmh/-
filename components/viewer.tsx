"use client";

import React, { useState, useEffect, useRef } from "react";
import type { JSX } from "react";
import { JSONContent } from "@tiptap/react";

export default function Viewer({ entryId, categoryId }: { entryId: number; categoryId: number }) {
  const [initialContent, setInitialContent] = useState<JSONContent | null>(null);
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeHeading, setActiveHeading] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 提取副标题（纯按字号和加粗）
  useEffect(() => {
    if (!initialContent) return;
    const extractedHeadings: { id: string; text: string }[] = [];
    initialContent.content?.forEach((node, index) => {
      if (
        node.content?.some(content =>
          content.marks?.some(
            mark =>
              mark.type === 'textStyle' &&
              mark.attrs?.fontSize === '24px' &&
              content.marks?.some(m => m.type === 'bold')
          )
        )
      ) {
        const text = node.content?.map(c => c.text).join('') || `Heading ${index + 1}`;
        extractedHeadings.push({ id: `heading-${index}`, text });
      }
    });
    setHeadings(extractedHeadings);
  }, [initialContent]);

  // 监听滚动高亮
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !headings.length) return;
      let closestId: string | null = null;
      let minDistance = Infinity;
      headings.forEach(h => {
        const element = document.getElementById(h.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const scrollTop = scrollRef.current?.scrollTop || 0;
          const offsetTop = element.offsetTop - (scrollRef.current?.offsetTop || 0);
          const distance = Math.abs(offsetTop - scrollTop);
          if (distance < minDistance && rect.top >= -50 && rect.top <= 200) {
            minDistance = distance;
            closestId = h.id;
          }
        }
      });
      setActiveHeading(closestId);
    };

    const scroll = scrollRef.current;
    scroll?.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用
    return () => scroll?.removeEventListener('scroll', handleScroll);
  }, [headings]);

  // 加载内容
  useEffect(() => {
    const fetchEntry = async () => {
      const res = await fetch(`/api/entries/${categoryId}/${entryId}`);
      const data = await res.json();
      setInitialContent(data.content || '{}');
    };
    fetchEntry();
  }, [categoryId, entryId]);

  // 渲染节点
  const renderNode = (node: JSONContent, index: number): JSX.Element => {
    const isHeading =
      node.content?.some(content =>
        content.marks?.some(
          mark =>
            mark.type === 'textStyle' &&
            mark.attrs?.fontSize === '24px' &&
            content.marks?.some(m => m.type === 'bold')
        )
      ) || false;

    const style: React.CSSProperties = {};
    if (node.marks?.find(m => m.type === 'textStyle')?.attrs?.fontSize) {
      style.fontSize = node.marks.find(m => m.type === 'textStyle')?.attrs?.fontSize;
    }
    if (node.marks?.find(m => m.type === 'textStyle')?.attrs?.color) {
      style.color = node.marks.find(m => m.type === 'textStyle')?.attrs?.color;
    }
    if (node.marks?.find(m => m.type === 'bold')) {
      style.fontWeight = 'bold';
    }

    const content = node.content?.map((c, i) => {
      const textStyle = c.marks?.find(m => m.type === 'textStyle')?.attrs || {};
      const isBold = c.marks?.some(m => m.type === 'bold');
      return (
        <span
          key={i}
          style={{
            fontSize: textStyle.fontSize,
            color: textStyle.color,
            fontWeight: isBold ? 'bold' : 'normal',
          }}
        >
          {c.text}
        </span>
      );
    });

    if (isHeading) {
      return (
        <h2 key={index} id={`heading-${index}`} className="text-2xl font-bold mt-4 mb-2">
          {content}
        </h2>
      );
    }
    if (node.type === 'paragraph') {
      return (
        <p key={index} style={style} className="my-2 min-h-[1.5rem]">
          {content || <br />}
        </p>
      );
    }
    return (
      <div key={index} className="my-2 min-h-[1.5rem]">
        {content || <br />}
      </div>
    );
  };

  if (!initialContent) {
    return (
      <div className="flex w-full gap-4 pr-6">
        <div className="flex-1 max-w-[calc(100%-192px)] mr-auto">
          <div className="w-full min-h-[650px] max-h-[650px] prose pt-3">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-4 pr-6">
      {/* 编辑器区域 */}
      <div
        ref={scrollRef}
        className="flex-1 max-w-[calc(100%-192px)] mr-auto min-h-[650px] max-h-[650px] overflow-auto prose pt-3"
      >
        {initialContent.content?.map((node, index) => renderNode(node, index))}
      </div>
      {/* 右侧目录 */}
      {headings.length > 0 && (
        <aside className="hidden md:block w-48 bg-white border-l border-gray-200 sticky top-4 h-fit">
          <div className="p-4 space-y-4">
            <h3 className="text-lg font-bold">目录</h3>
            <ul className="space-y-2 text-sm">
              {headings.map(h => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className={`block p-2 rounded ${
                      activeHeading === h.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      const element = document.getElementById(h.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        setActiveHeading(h.id);
                      }
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}