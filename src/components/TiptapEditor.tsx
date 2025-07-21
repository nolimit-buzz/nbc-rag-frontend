  'use client';

  import { useEditor, EditorContent } from '@tiptap/react';
  import StarterKit from '@tiptap/starter-kit';
  import Underline from '@tiptap/extension-underline';
  import Highlight from '@tiptap/extension-highlight';
  import Table from '@tiptap/extension-table';
  import TableRow from '@tiptap/extension-table-row';
  import TableCell from '@tiptap/extension-table-cell';
  import TableHeader from '@tiptap/extension-table-header';
  import { ArrowPathIcon } from '@heroicons/react/24/outline';
  import Collaboration from '@tiptap/extension-collaboration'
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
  // import { createProvider } from '@/lib/yjs-setup'
  import { useEffect, useMemo, useRef, useState } from 'react';
  import { Socket } from '@/lib/socket';
  import * as Y from 'yjs';
  import { YSocketProvider } from '@/lib/yjs-setup';
  export default function TiptapEditor({
    roomName,
    content,
    onChange,
    onRegenerate,
    isRegenerating = false,
  }: {
    roomName: string;
    content: string;
    onChange: (html: string) => void;
    onRegenerate?: () => void;
    isRegenerating?: boolean;
  }) {
    const socketProviderRef = useRef<YSocketProvider | null>(null);

    if (!socketProviderRef.current) {
      socketProviderRef.current = new YSocketProvider(roomName);
  
      const ydoc = socketProviderRef.current.doc;
      const fragment = ydoc.get('prosemirror', Y.XmlFragment);
  
      // // Initialize only once if empty
      // if (fragment.length === 0 && content) {
      //   const tempEditor = document.createElement('div');
      //   tempEditor.innerHTML = content;
  
      //   Array.from(tempEditor.childNodes).forEach(node => {
      //     fragment.insert(fragment.length, [Y.XmlElement.fromDOM(node)]);
      //   });
      // }
    }
  
    const editor = useEditor({
      extensions: [
        StarterKit,
        Underline,
        Highlight.configure({ multicolor: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Collaboration.configure({
          document: socketProviderRef.current.doc,
        }),
        CollaborationCursor.configure({
          provider: socketProviderRef.current,
          user: {
            name: 'Karen',
            color: '#f783ac',
          },
        }),
      ],
      content,
      onCreate({ editor }) {
        const fragment = editor.storage.collaboration?.document?.get('prosemirror', Y.XmlFragment);
        console.log('Fragment onCreate:', fragment?.toJSON());
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });
  
    return (
      <div className="tiptap-editor">
        {editor && (
          <div className="editor-toolbar">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}><b>B</b></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}><i>I</i></button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}><u>U</u></button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>&bull; List</button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. List</button>
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'active' : ''} style={{ color: '#facc15' }}>A</button>
            <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
            <button onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>+Col</button>
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>Col+</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>-Col</button>
            <button onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>+Row</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>Row+</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>-Row</button>
            <button onClick={() => editor.chain().focus().deleteTable().run()} disabled={!editor.can().deleteTable()}>Del Table</button>
            <button onClick={onRegenerate} disabled={isRegenerating} className={isRegenerating ? 'active' : ''}>
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="editor-container">
          <EditorContent editor={editor} />
        </div>

        <style jsx global>{`
          .tiptap-editor .editor-toolbar {
            display: flex;
            gap: 4px;
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            background: #f9fafb;
            flex-wrap: wrap;
          }
          
          .tiptap-editor .editor-toolbar button {
            padding: 4px 8px;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
          }
          
          .tiptap-editor .editor-toolbar button:hover:not(:disabled) {
            background: #f3f4f6;
            border-color: #9ca3af;
          }
          
          .tiptap-editor .editor-toolbar button.active {
            background: #ea580c;
            color: white;
            border-color: #ea580c;
          }
          
          .tiptap-editor .editor-toolbar button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .tiptap-editor .editor-container {
            padding: 16px;
            min-height: 200px;
          }
          
          /* Table Styles - Global scope to ensure they apply to ProseMirror content */
          .ProseMirror table {
            border-collapse: separate !important;
            border-spacing: 0 !important;
            margin: 1.5em 0 !important;
            overflow: hidden !important;
            table-layout: fixed !important;
            width: 100% !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 12px !important;
            background: white !important;
          }
          
          .ProseMirror table td,
          .ProseMirror table th {
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            border-right: 1px solid #e5e7eb !important;
            box-sizing: border-box !important;
            min-width: 1em !important;
            padding: 16px 20px !important;
            position: relative !important;
            vertical-align: top !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
          }
          
          .ProseMirror table th {
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
            font-weight: 600 !important;
            text-align: left !important;
            color: #374151 !important;
            font-size: 14px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
            border-bottom: 2px solid #e5e7eb !important;
          }
          
          .ProseMirror table td {
            background-color: white !important;
            color: #4b5563 !important;
          }
          
          .ProseMirror table tr:last-child td {
            border-bottom: none !important;
          }
          
          .ProseMirror table td:last-child,
          .ProseMirror table th:last-child {
            border-right: none !important;
          }
          
          .ProseMirror table tr:hover td {
            background-color: #f9fafb !important;
            transition: background-color 0.2s ease !important;
          }
          
          .ProseMirror table .selectedCell:after {
            background: rgba(59, 130, 246, 0.1) !important;
            content: "" !important;
            left: 0 !important;
            right: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            pointer-events: none !important;
            position: absolute !important;
            z-index: 2 !important;
            border-radius: 4px !important;
          }
          
          .ProseMirror table .column-resize-handle {
            background-color: #3b82f6 !important;
            bottom: -2px !important;
            position: absolute !important;
            right: -2px !important;
            pointer-events: none !important;
            top: 0 !important;
            width: 4px !important;
            border-radius: 2px !important;
          }
          
          .ProseMirror table p {
            margin: 0 !important;
          }
          
          /* Table wrapper for better styling */
          .ProseMirror .tableWrapper {
            overflow-x: auto !important;
            margin: 1.5em 0 !important;
            border-radius: 12px !important;
          }
          
          /* List Styles */
          .ProseMirror ul {
            list-style-type: disc !important;
            padding-left: 1.5em !important;
            margin: 1em 0 !important;
          }
          
          .ProseMirror ul li {
            display: list-item !important;
            list-style-type: disc !important;
            margin: 0.5em 0 !important;
          }
          
          .ProseMirror ol {
            list-style-type: decimal !important;
            padding-left: 1.5em !important;
            margin: 1em 0 !important;
          }
          
          .ProseMirror ol li {
            display: list-item !important;
            list-style-type: decimal !important;
            margin: 0.5em 0 !important;
          }
          
          .ProseMirror ul ul {
            list-style-type: circle !important;
          }
          
          .ProseMirror ul ul ul {
            list-style-type: square !important;
          }
          
          .ProseMirror ol ol {
            list-style-type: lower-alpha !important;
          }
          
          .ProseMirror ol ol ol {
            list-style-type: lower-roman !important;
          }
        `}</style>
      </div>
    );
  }
