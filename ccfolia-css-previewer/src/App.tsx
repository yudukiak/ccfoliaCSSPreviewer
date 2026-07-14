import { useState } from "react";
import { CcfoliaField } from "@/components/CcfoliaField";
import { CcfoliaTabs } from "@/components/CcfoliaTabs";
import { DevToolsButtons } from "@/components/DevToolsButtons";
import type { PreviewTarget } from "@/data/cssLists";

export default function App() {
  const [preview, setPreview] = useState<PreviewTarget | null>(null);

  return (
    <main className="flex h-dvh flex-col gap-4 p-4">
      <section className="shrink-0">
        <CcfoliaField
          onPreview={(target) => {
            setPreview(target);
          }}
        />
      </section>
      <section className="min-h-0 flex-1">
        <CcfoliaTabs preview={preview} />
      </section>
      <DevToolsButtons />
    </main>
  );
}
