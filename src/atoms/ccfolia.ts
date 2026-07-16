import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const UNSET_PUBLISHED_VALUE = "未設定";

type StoredField = {
  ccfoliaUrl: string;
  ccfoliaCharacterId: string;
};

const storedFieldAtom = atomWithStorage<StoredField>(
  "ccfolia-css-previewer:field",
  { ccfoliaUrl: "", ccfoliaCharacterId: "" },
);

export const ccfoliaUrlAtom = atom(
  (get) => get(storedFieldAtom).ccfoliaUrl,
  (get, set, url: string) =>
    set(storedFieldAtom, { ...get(storedFieldAtom), ccfoliaUrl: url }),
);

export const ccfoliaCharacterIdAtom = atom(
  (get) => get(storedFieldAtom).ccfoliaCharacterId,
  (get, set, id: string) =>
    set(storedFieldAtom, {
      ...get(storedFieldAtom),
      ccfoliaCharacterId: id,
    }),
);

export const selectedPublishedTitleAtom = atom(UNSET_PUBLISHED_VALUE);

export const selectedAssetTitlesAtom = atom<string[]>([]);

export const cssTextAtom = atom("");
