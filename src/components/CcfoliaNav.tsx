import { useAtom } from "jotai";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea";
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
  cssTextAtom,
  selectedAssetTitlesAtom,
  selectedPublishedTitleAtom,
} from "@/atoms/ccfolia";
import { cssLists } from "@/data/cssLists";

const cssPlaceholder = `/* 例 */
body {
  background: red;
}

.custom-css {
  background: #e1344c;
  color: #f6f7f8;
  padding: 0.75rem 1.25rem;
}
`;

export function CcfoliaNav() {
  const publishedCssLists = cssLists.filter((list) => list.hpUrl !== undefined);
  const assetCssLists = cssLists.filter((list) => list.hpUrl === undefined);
  const [cssText, setCssText] = useAtom(cssTextAtom);
  const [selectedPublishedTitle, setSelectedPublishedTitle] = useAtom(
    selectedPublishedTitleAtom,
  );
  const [selectedAssetTitles, setSelectedAssetTitles] = useAtom(
    selectedAssetTitlesAtom,
  );

  return (
    <nav>
      <ScrollArea className="h-full pr-2">
        <Accordion multiple className="border-none" defaultValue={["公開CSS", "アセット"]}>
          <AccordionItem className="bg-transparent! border-none" value="カスタムCSS">
            <AccordionTrigger>カスタムCSS</AccordionTrigger>
            <AccordionContent>
              <Textarea
                className="h-full font-mono text-xs field-sizing-fixed"
                placeholder={cssPlaceholder}
                wrap="off"
                rows={10}
                value={cssText}
                onChange={(e) => setCssText(e.target.value)}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="bg-transparent! border-none" value="公開CSS">
            <AccordionTrigger>公開CSS</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="bg-transparent! border-none" value="アセット">
            <AccordionTrigger>アセット</AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </nav>
  );
}
