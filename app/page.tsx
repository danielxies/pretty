"use client"

import SimpleTextArea from "@/components/SimpleTextArea";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-black font-[family-name:var(--font-geist-sans)]">
      <main className="h-full w-full">
        <SimpleTextArea
          prompt={prompt}
          setPrompt={setPrompt}
        />
      </main>
    </div>
  );
}
