"use client"

import SimpleTextArea from "@/components/SimpleTextArea";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="h-screen w-screen bg-black font-[family-name:var(--font-geist-sans)]">
      <SimpleTextArea
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </div>
  );
}
