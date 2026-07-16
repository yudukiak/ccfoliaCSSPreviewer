import { useAtom } from "jotai";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  selectedAssetTitlesAtom,
  selectedPublishedTitleAtom,
  UNSET_PUBLISHED_VALUE,
} from "@/atoms/ccfolia";
import { cssLists } from "@/data/cssLists";

export function CcfoliaNav() {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl !== undefined);
  const assetCssLists = cssLists.filter((list) => list.hpUrl === undefined);
  const [selectedPublishedTitle, setSelectedPublishedTitle] = useAtom(
    selectedPublishedTitleAtom,
  );
  const [selectedAssetTitles, setSelectedAssetTitles] = useAtom(
    selectedAssetTitlesAtom,
  );

  return (
    <nav>
      <ScrollArea className="h-full pr-4">
        <h2 className="text-sm font-medium text-foreground">公開CSS</h2>
        <RadioGroup
          value={selectedPublishedTitle}
          onValueChange={setSelectedPublishedTitle}
          className="gap-0.5"
        >
          {publishedCssLists.map((list) => (
            <FieldLabel htmlFor={list.title} key={list.title}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{list.title}</FieldTitle>
                </FieldContent>
                <RadioGroupItem value={list.title} id={list.title} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        <h2 className="text-sm font-medium text-foreground">アセット</h2>
        <div className="flex flex-col gap-0.5">
          {assetCssLists.map((list) => (
            <FieldLabel htmlFor={list.title} key={list.title}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{list.title}</FieldTitle>
                </FieldContent>
                <Checkbox
                  id={list.title}
                  checked={selectedAssetTitles.includes(list.title)}
                  onCheckedChange={(checked) => {
                    setSelectedAssetTitles(
                      checked
                        ? [...selectedAssetTitles, list.title]
                        : selectedAssetTitles.filter(
                            (title) => title !== list.title,
                          ),
                    );
                  }}
                />
              </Field>
            </FieldLabel>
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}
