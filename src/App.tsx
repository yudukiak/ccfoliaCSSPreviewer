import { CcfoliaNav } from "@/components/CcfoliaNav";
import { CcfoliaField } from "@/components/CcfoliaField";
import { CcfoliaTabs } from "@/components/CcfoliaTabs";
import { DevToolsButtons } from "@/components/DevToolsButtons";

export default function App() {
  return (
    <>
      <main className="grid h-dvh grid-cols-[240px_1fr] grid-rows-[minmax(0,1fr)] gap-4 p-4">
        <CcfoliaNav />
        <article className="grid h-full grid-rows-[auto_minmax(0,1fr)] gap-4">
          <CcfoliaField />
          <CcfoliaTabs />
        </article>
      </main>
      <DevToolsButtons />
    </>
  );
}
