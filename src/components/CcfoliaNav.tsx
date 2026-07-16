import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cssLists } from "@/data/cssLists";

const UNSET_VALUE = "未設定";

export function CcfoliaNav() {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl);
  const assetCssLists = cssLists.filter((list) => !list.hpUrl);
  const [selectedPublishedTitle, setSelectedPublishedTitle] = useState(UNSET_VALUE);
  const [selectedAssetTitle, setSelectedAssetTitle] = useState(UNSET_VALUE);

  return (
    <nav>
      <ScrollArea className="h-full pr-4">
        <h2 className="text-sm font-medium text-foreground">公開CSS</h2>
        <RadioGroup
          value={selectedPublishedTitle}
          onValueChange={setSelectedPublishedTitle}
          className="gap-0.5"
        >
          <FieldLabel htmlFor={UNSET_VALUE}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{UNSET_VALUE}</FieldTitle>
              </FieldContent>
              <RadioGroupItem value={UNSET_VALUE} id={UNSET_VALUE} />
            </Field>
          </FieldLabel>
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
        <RadioGroup
          value={selectedAssetTitle}
          onValueChange={setSelectedAssetTitle}
          className="gap-0.5"
        >
          {assetCssLists.map((list) => (
            <FieldLabel htmlFor={list.title} key={list.title}>
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{list.title}</FieldTitle>
                </FieldContent>
                <Checkbox value={list.title} id={list.title} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
      </ScrollArea>
    </nav>
  );
}
