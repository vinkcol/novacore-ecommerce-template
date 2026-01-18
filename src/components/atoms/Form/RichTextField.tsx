"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useField, useFormikContext } from "formik";
import { FormFieldWrapper } from "./FormFieldWrapper";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    description?: string;
    className?: string;
    required?: boolean;
}

const MenuButton = ({
    isActive,
    onClick,
    children,
    title
}: {
    isActive?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
            "p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground",
            isActive && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        )}
    >
        {children}
    </button>
);

export function RichTextField({
    name,
    label,
    placeholder,
    description,
    className,
    required
}: RichTextFieldProps) {
    const [field, meta, helpers] = useField(name);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || "Escribe aquí...",
                emptyEditorClass: "is-editor-empty before:content-[attr(data-placeholder)] before:float-left before:text-muted-foreground/50 before:pointer-events-none h-full",
            }),
            Underline,
        ],
        content: field.value || "",
        editorProps: {
            attributes: {
                class: "min-h-[150px] w-full rounded-b-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-headings:my-2 focus:border-primary/50 transition-colors",
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            // If empty (just <p></p>), set to empty string to trigger required validation if needed
            helpers.setValue(editor.isEmpty ? "" : html);
        },
    });

    // Update content if form value changes externally (e.g. initial load)
    useEffect(() => {
        if (editor && field.value !== editor.getHTML()) {
            // Only update if content is different to avoid cursor jumps
            if (editor.isEmpty && !field.value) return; // both empty
            editor.commands.setContent(field.value || "");
        }
    }, [editor, field.value]);

    return (
        <FormFieldWrapper
            label={label}
            description={description}
            required={required}
            className={className}
        >
            <div className={cn(
                "rounded-xl border border-input bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring focus-within:border-primary",
                meta.touched && meta.error && "border-destructive focus-within:border-destructive focus-within:ring-destructive"
            )}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b bg-muted/20 p-1">
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleBold().run()}
                        isActive={editor?.isActive("bold")}
                        title="Bold"
                    >
                        <Bold size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleItalic().run()}
                        isActive={editor?.isActive("italic")}
                        title="Italic"
                    >
                        <Italic size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        isActive={editor?.isActive("underline")}
                        title="Underline"
                    >
                        <UnderlineIcon size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleStrike().run()}
                        isActive={editor?.isActive("strike")}
                        title="Strikethrough"
                    >
                        <Strikethrough size={16} />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-border mx-1" />

                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleBulletList().run()}
                        isActive={editor?.isActive("bulletList")}
                        title="Bullet List"
                    >
                        <List size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                        isActive={editor?.isActive("orderedList")}
                        title="Ordered List"
                    >
                        <ListOrdered size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                        isActive={editor?.isActive("blockquote")}
                        title="Quote"
                    >
                        <Quote size={16} />
                    </MenuButton>

                    <div className="w-[1px] h-6 bg-border mx-1" />

                    <MenuButton
                        onClick={() => editor?.chain().focus().undo().run()}
                        title="Undo"
                    >
                        <Undo size={16} />
                    </MenuButton>
                    <MenuButton
                        onClick={() => editor?.chain().focus().redo().run()}
                        title="Redo"
                    >
                        <Redo size={16} />
                    </MenuButton>
                </div>

                <EditorContent editor={editor} className="[&_.ProseMirror]:border-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:p-4" />
            </div>
        </FormFieldWrapper>
    );
}
