import React, { useState } from "react";

export function NotesApp() {
  const [text, setText] = useState("");

  return (
    <div className="w-full h-full min-w-[300px] min-h-[300px] bg-[#f9f9f9] flex flex-col rounded-b-xl overflow-hidden">
      <div className="bg-yellow-200 p-2 border-b border-yellow-300 flex justify-between items-center text-black">
        <span className="font-semibold text-sm">Quick Notes</span>
      </div>
      <textarea
        className="flex-1 w-full p-4 resize-none outline-none text-black bg-transparent"
        placeholder="Type something cool here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
