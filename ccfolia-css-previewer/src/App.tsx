import { useState } from "react";
import { CcfoliaField } from "@/components/CcfoliaField";
import { CcfoliaTabs } from "@/components/CcfoliaTabs";
import type { PreviewTarget } from "@/data/cssLists";

export default function App() {
  const [showTabs, setShowTabs] = useState(false);
  const [preview, setPreview] = useState<PreviewTarget | null>(null);

  return (
    <main className="p-6 space-y-4">
      <section className="space-y-4">
        <h1 className="text-lg font-medium">ルーム情報</h1>
        <CcfoliaField
          onSearch={(target) => {
            setPreview(target);
            setShowTabs(true);
          }}
        />
      </section>
      {showTabs && preview && <CcfoliaTabs preview={preview} />}
    </main>
  );
}
