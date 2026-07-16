import { CcfoliaNav } from "@/components/CcfoliaNav";
import { CcfoliaField } from "@/components/CcfoliaField";
import { CcfoliaPreview } from "@/components/CcfoliaPreview";

export default function App() {
  return (
    <main className="grid h-dvh grid-cols-[300px_1fr] grid-rows-[minmax(0,1fr)] gap-4 p-4">
      <CcfoliaNav />
      <article className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-4">
        <CcfoliaField />
        <CcfoliaPreview />
      </article>
    </main>
  );
}
