import { useAtom, useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  characterIdAtom,
  previewTargetAtom,
  roomUrlAtom,
} from "@/atoms/ccfolia";

export function CcfoliaField() {
  const [roomUrl, setRoomUrl] = useAtom(roomUrlAtom);
  const [characterId, setCharacterId] = useAtom(characterIdAtom);
  const setPreviewTarget = useSetAtom(previewTargetAtom);

  const isUrlOk = /^https:\/\/ccfolia\.com\/rooms\/[^/?#\s]+\/?$/.test(
    roomUrl.trim(),
  );
  const isCharacterIdOk = /^[a-zA-Z0-9]+$/.test(characterId.trim());
  const canPreview = isUrlOk && isCharacterIdOk;

  return (
    <FieldGroup className="grid grid-cols-[1fr_1fr_100px] items-end gap-4">
      <Field
        data-invalid={!isUrlOk}
        orientation="horizontal"
        className="*:data-[slot=field-label]:flex-none *:data-[slot=field-input]:flex-1"
      >
        <FieldLabel htmlFor="room-url">
          ルームURL <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="room-url"
          required
          placeholder="https://ccfolia.com/rooms/XXXXX"
          value={roomUrl}
          onChange={(e) => setRoomUrl(e.target.value)}
          aria-invalid={!isUrlOk}
        />
      </Field>

      <Field
        data-invalid={!isCharacterIdOk}
        orientation="horizontal"
        className="*:data-[slot=field-label]:flex-none *:data-[slot=field-input]:flex-1"
      >
        <FieldLabel htmlFor="character-id">
          Character ID <span className="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="character-id"
          required
          placeholder="英数字のID"
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          aria-invalid={!isCharacterIdOk}
        />
      </Field>

      <Button
        disabled={!canPreview}
        onClick={() => {
          const normalizedRoomUrl = roomUrl.replace(/\/$/, "");
          const characterUrl = `${normalizedRoomUrl}/characters/${characterId.trim()}`;
          setPreviewTarget({ roomUrl: normalizedRoomUrl, characterUrl });
        }}
      >
        プレビュー
      </Button>
    </FieldGroup>
  );
}
