import { useState } from "react";
import { CcfoliaNav } from "@/components/CcfoliaNav";
import { CcfoliaField } from "@/components/CcfoliaField";
import { CcfoliaTabs } from "@/components/CcfoliaTabs";
import { DevToolsButtons } from "@/components/DevToolsButtons";
import type { PreviewTarget } from "@/data/cssLists";

export default function App() {
  const [preview, setPreview] = useState<PreviewTarget | null>(null);

  return (
    <>
      <main className="grid h-dvh grid-cols-[240px_1fr] grid-rows-[minmax(0,1fr)] gap-4 p-4">
        <CcfoliaNav />
        <article className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-4">
          <CcfoliaField
            onPreview={(target) => {
              setPreview(target);
            }}
          />
          <CcfoliaTabs preview={preview} />
        </article>
      </main>
      <DevToolsButtons />
    </>
  );
}
