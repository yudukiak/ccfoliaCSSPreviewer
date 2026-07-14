import { useState } from "react";
import { LuCircleCheck, LuCircleX } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PreviewTarget } from "@/data/cssLists";
import { cn } from "@/lib/utils";

type CcfoliaFieldProps = {
  onPreview: (target: PreviewTarget) => void;
};

export function CcfoliaField({ onPreview }: CcfoliaFieldProps) {
  const [ccfoliaUrl, setCcfoliaUrl] = useState("");
  const [ccfoliaCharacterId, setCcfoliaCharacterId] = useState("");

  const isUrlOk = /^https:\/\/ccfolia\.com\/rooms\/[^/?#\s]+\/?$/.test(ccfoliaUrl.trim());
  const isCharacterIdOk = /^[a-zA-Z0-9]+$/.test(ccfoliaCharacterId.trim());
  const canPreview = isUrlOk && isCharacterIdOk;

  return (
    <FieldGroup className="grid grid-cols-[1fr_1fr_100px] gap-4 items-end">
      <Field orientation="horizontal" className="*:data-[slot=field-label]:flex-none">
        <FieldLabel htmlFor="ccfoliaUrl">
          <ValidationStatusItem ok={isUrlOk}>ルームURL</ValidationStatusItem>
        </FieldLabel>
        <Input
          id="ccfoliaUrl"
          className="min-w-0 flex-1"
          placeholder="https://ccfolia.com/rooms/XXXXX"
          value={ccfoliaUrl}
          onChange={(e) => setCcfoliaUrl(e.target.value)}
          aria-invalid={ccfoliaUrl.length > 0 && !isUrlOk}
        />
      </Field>

      <Field orientation="horizontal" className="*:data-[slot=field-label]:flex-none">
        <FieldLabel htmlFor="ccfoliaCharacterId">
          <ValidationStatusItem ok={isCharacterIdOk}>Character ID</ValidationStatusItem>
        </FieldLabel>
        <Input
          id="ccfoliaCharacterId"
          className="min-w-0 flex-1"
          placeholder="英数字のID"
          value={ccfoliaCharacterId}
          onChange={(e) => setCcfoliaCharacterId(e.target.value)}
          aria-invalid={ccfoliaCharacterId.length > 0 && !isCharacterIdOk}
        />
      </Field>

      <Button
        disabled={!canPreview}
        onClick={() => {
          const roomUrl = ccfoliaUrl.replace(/\/$/, "");
          const characterUrl = `${roomUrl}/characters/${ccfoliaCharacterId.trim()}`;
          onPreview({ roomUrl, characterUrl });
        }}
      >
        プレビュー
      </Button>
    </FieldGroup>
  );
}

interface ValidationStatusItemProps {
  ok: boolean;
  children?: React.ReactNode;
}

function ValidationStatusItem({ ok, children }: ValidationStatusItemProps) {
  const className = cn("flex items-center gap-2", ok ? "text-green-600" : "text-destructive");
  const Icon = ok ? LuCircleCheck : LuCircleX;
  return (
    <span className={cn("text-sm", className)}>
      <Icon className="size-4 shrink-0" />
      {children}
    </span>
  );
}
