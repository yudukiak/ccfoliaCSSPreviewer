import { useState } from "react";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PreviewTarget } from "@/data/cssLists";
import { cn } from "@/lib/utils";

type CcfoliaFieldProps = {
  onSearch: (target: PreviewTarget) => void;
};

export function CcfoliaField({ onSearch }: CcfoliaFieldProps) {
  const [ccfoliaUrl, setCcfoliaUrl] = useState("");
  const [ccfoliaCharacterId, setCcfoliaCharacterId] = useState("");

  const isUrlOk = /^https:\/\/ccfolia\.com\/rooms\/[^/?#\s]+\/?$/.test(ccfoliaUrl.trim());
  const isCharacterIdOk = /^[a-zA-Z0-9]+$/.test(ccfoliaCharacterId.trim());
  const canSearch = isUrlOk && isCharacterIdOk;

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="ccfoliaUrl">ルームURL</FieldLabel>
        <Input id="ccfoliaUrl" placeholder="https://ccfolia.com/rooms/XXXXX" value={ccfoliaUrl} onChange={(e) => setCcfoliaUrl(e.target.value)} aria-invalid={ccfoliaUrl.length > 0 && !isUrlOk} />
      </Field>

      <Field>
        <FieldLabel htmlFor="ccfoliaCharacterId">Character ID</FieldLabel>
        <Input id="ccfoliaCharacterId" placeholder="英数字のID" value={ccfoliaCharacterId} onChange={(e) => setCcfoliaCharacterId(e.target.value)} aria-invalid={ccfoliaCharacterId.length > 0 && !isCharacterIdOk} />
      </Field>

      <ul className="flex flex-col gap-2 text-sm">
        <ValidationStatusItem ok={isUrlOk} okText="ルームURLの形式OK" ngText="https://ccfolia.com/rooms/XXXXX の形式で入力してね" />
        <ValidationStatusItem ok={isCharacterIdOk} okText="Character ID OK" ngText="Character IDは英数字で入力してね" />
      </ul>

      <Button
        className="w-full"
        disabled={!canSearch}
        onClick={() => {
          const roomUrl = ccfoliaUrl.replace(/\/$/, "");
          const characterUrl = `${roomUrl}/characters/${ccfoliaCharacterId.trim()}`;
          onSearch({ roomUrl, characterUrl });
        }}
      >
        Search
      </Button>
    </FieldGroup>
  );
}

function ValidationStatusItem({ ok, okText, ngText }: { ok: boolean; okText: string; ngText: string }) {
  const liClassName = cn("flex items-start gap-2", ok ? "text-green-600" : "text-destructive");
  const Icon = ok ? LuCircleCheck : LuCircleX;
  return (
    <li className={liClassName}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{ok ? okText : ngText}</span>
    </li>
  );
}
