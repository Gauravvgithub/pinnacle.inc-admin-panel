import React, { useRef, useState, useEffect } from 'react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Color from '@tiptap/extension-color';
import {TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';
import clsx from 'clsx';

// Custom Toolbar component with better styling
const BlogEditorToolbar = () => {
    const { editor } = useCurrentEditor();
    if (!editor) return null;

    const ToolbarButton = ({ 
        onClick, 
        isActive = false, 
        disabled = false, 
        children, 
        title 
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={clsx(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                'border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                {
                    'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700': isActive,
                    'bg-white text-gray-700 hover:bg-gray-50': !isActive && !disabled,
                    'bg-gray-100 text-gray-400 cursor-not-allowed': disabled,
                }
            )}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-t-md bg-gray-50 p-3">
            <div className="flex flex-wrap gap-2">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <strong>B</strong>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <em>I</em>
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <u>U</u>
                    </ToolbarButton>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        H1
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        H2
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        H3
                    </ToolbarButton>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        • List
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        1. List
                    </ToolbarButton>
                </div>

                {/* Links */}
                <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                    <ToolbarButton
                        onClick={() => {
                            const url = window.prompt('Enter URL');
                            if (url) {
                                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                            }
                        }}
                        isActive={editor.isActive('link')}
                        title="Add Link"
                    >
                        🔗 Link
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        disabled={!editor.isActive('link')}
                        title="Remove Link"
                    >
                        🔗✕ Unlink
                    </ToolbarButton>
                </div>

                {/* History */}
                <div className="flex gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        ↶ Undo
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        ↷ Redo
                    </ToolbarButton>
                </div>
            </div>
        </div>
    );
};

// Props interface
interface CustomBlogEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

// Main Editor Component
const CustomBlogEditor: React.FC<CustomBlogEditorProps> = ({ 
    value, 
    onChange, 
    placeholder = "Start writing your blog content...",
    className = ""
}) => {
    return (
        <div className={`border border-gray-300 rounded-md ${className}`}>
            <EditorProvider
                extensions={[
                    StarterKit.configure({
                        heading: {
                            levels: [1, 2, 3],
                        },
                    }),
                    Color.configure({ types: [TextStyle.name, ListItem.name] }),
                    TextStyle,
                    Underline,
                    Link.configure({
                        openOnClick: false,
                        HTMLAttributes: {
                            class: 'text-indigo-600 underline hover:text-indigo-800',
                        },
                    }),
                ]}
                content={value}
                onUpdate={({ editor }) => {
                    onChange(editor.getHTML());
                }}
                slotBefore={<BlogEditorToolbar />}
                editorProps={{
                    attributes: {
                        class: 'prose prose-xs mx-auto focus:outline-none p-3 min-h-[300px] max-w-none',
                        style: 'height: 300px; max-height: 400px; overflow-y: auto;',
                    },
                }}
            >
                <div className="border-t border-gray-200 bg-white rounded-b-md">
                    <div className="p-4 text-gray-500 text-sm">
                        <div className="flex justify-between items-center">
                            <span>💡 Tip: Use headings to structure your content</span>
                            <span className="text-xs">
                                {value.replace(/<[^>]*>/g, '').length} characters
                            </span>
                        </div>
                    </div>
                </div>
            </EditorProvider>
        </div>
    );
};

export default CustomBlogEditor;
