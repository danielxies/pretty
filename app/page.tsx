"use client"

import SimpleTextArea from "@/components/SimpleTextArea";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-4xl">
        <SimpleTextArea
          prompt={prompt}
          setPrompt={setPrompt}
          charCount={charCount}
          setCharCount={setCharCount}
        />
      </main>
    </div>
  );
}
