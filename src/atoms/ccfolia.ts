import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { UNSET_PUBLISHED_ID } from "@/data/cssLists";

type StoredPreviewField = {
  roomUrl: string;
  characterId: string;
};

const previewFieldStorageAtom = atomWithStorage<StoredPreviewField>(
  "ccfolia-css-previewer:v1:field",
  { roomUrl: "", characterId: "" },
);

export const roomUrlAtom = atom(
  (get) => get(previewFieldStorageAtom).roomUrl,
  (get, set, roomUrl: string) =>
    set(previewFieldStorageAtom, {
      ...get(previewFieldStorageAtom),
      roomUrl,
    }),
);

export const characterIdAtom = atom(
  (get) => get(previewFieldStorageAtom).characterId,
  (get, set, characterId: string) =>
    set(previewFieldStorageAtom, {
      ...get(previewFieldStorageAtom),
      characterId,
    }),
);

export const publishedCssIdAtom = atom(UNSET_PUBLISHED_ID);

export const assetCssIdsAtom = atom<string[]>([]);

export const customCssTextAtom = atom("");
