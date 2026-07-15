import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { PreviewTarget } from "@/data/cssLists";

const STORAGE_KEY = "ccfolia-css-previewer:field";

type StoredField = {
  ccfoliaUrl: string;
  ccfoliaCharacterId: string;
};

function loadStoredField(): StoredField {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ccfoliaUrl: "", ccfoliaCharacterId: "" };

    const parsed = JSON.parse(raw) as Partial<StoredField>;
    return {
      ccfoliaUrl: typeof parsed.ccfoliaUrl === "string" ? parsed.ccfoliaUrl : "",
      ccfoliaCharacterId:
        typeof parsed.ccfoliaCharacterId === "string"
          ? parsed.ccfoliaCharacterId
          : "",
    };
  } catch {
    return { ccfoliaUrl: "", ccfoliaCharacterId: "" };
  }
}

function saveStoredField(value: StoredField) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

type CcfoliaFieldProps = {
  onPreview: (target: PreviewTarget) => void;
};

export function CcfoliaField({ onPreview }: CcfoliaFieldProps) {
  const [ccfoliaUrl, setCcfoliaUrl] = useState(
    () => loadStoredField().ccfoliaUrl,
  );
  const [ccfoliaCharacterId, setCcfoliaCharacterId] = useState(
    () => loadStoredField().ccfoliaCharacterId,
  );

  useEffect(() => {
    saveStoredField({ ccfoliaUrl, ccfoliaCharacterId });
  }, [ccfoliaUrl, ccfoliaCharacterId]);

  const isUrlOk = /^https:\/\/ccfolia\.com\/rooms\/[^/?#\s]+\/?$/.test(
    ccfoliaUrl.trim(),
  );
  const isCharacterIdOk = /^[a-zA-Z0-9]+$/.test(ccfoliaCharacterId.trim());
  const canPreview = isUrlOk && isCharacterIdOk;

  return (
    <FieldGroup className="grid grid-cols-[1fr_1fr_100px] items-end gap-4">
      <Field
        data-invalid={!isUrlOk}
        orientation="horizontal"
        className="*:data-[slot=field-label]:flex-none *:data-[slot=field-input]:flex-1"
      >
        <FieldLabel htmlFor="ccfoliaUrl">
          ルームURL <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="ccfoliaUrl"
          required
          placeholder="https://ccfolia.com/rooms/XXXXX"
          value={ccfoliaUrl}
          onChange={(e) => setCcfoliaUrl(e.target.value)}
          aria-invalid={!isUrlOk}
        />
      </Field>

      <Field
        data-invalid={!isCharacterIdOk}
        orientation="horizontal"
        className="*:data-[slot=field-label]:flex-none *:data-[slot=field-input]:flex-1"
      >
        <FieldLabel htmlFor="ccfoliaCharacterId">
          Character ID <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="ccfoliaCharacterId"
          required
          placeholder="英数字のID"
          value={ccfoliaCharacterId}
          onChange={(e) => setCcfoliaCharacterId(e.target.value)}
          aria-invalid={!isCharacterIdOk}
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
