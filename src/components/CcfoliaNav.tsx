import { FaGithub, FaHome } from "react-icons/fa";
import { useAtom } from "jotai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Link } from "@/components/ui/link";
import {
  assetCssIdsAtom,
  customCssTextAtom,
  publishedCssIdAtom,
} from "@/atoms/ccfolia";
import { assetCssLists, publishedCssLists } from "@/data/cssLists";

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
  const [customCssText, setCustomCssText] = useAtom(customCssTextAtom);
  const [publishedCssId, setPublishedCssId] = useAtom(publishedCssIdAtom);
  const [assetCssIds, setAssetCssIds] = useAtom(assetCssIdsAtom);

  return (
    <nav>
      <ScrollArea className="h-full pr-2">
        <Accordion
          multiple
          className="border-none"
          defaultValue={["published", "assets"]}
        >
          <AccordionItem
            className="bg-transparent! border-none"
            value="custom-css"
          >
            <AccordionTrigger>カスタムCSS</AccordionTrigger>
            <AccordionContent>
              <Textarea
                className="h-full font-mono text-xs field-sizing-fixed"
                placeholder={cssPlaceholder}
                wrap="off"
                rows={10}
                value={customCssText}
                onChange={(e) => setCustomCssText(e.target.value)}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            className="bg-transparent! border-none"
            value="published"
          >
            <AccordionTrigger>公開CSS</AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={publishedCssId}
                onValueChange={setPublishedCssId}
                className="gap-0.5"
              >
                {publishedCssLists.map((list) => {
                  const domId = `css-published-${list.id}`;
                  const Home = list.homepageUrl ? <Link href={list.homepageUrl}><FaHome className="size-4" /></Link> : <span></span>;
                  const Github = list.cssUrl ? <Link href={list.cssUrl}><FaGithub className="size-4" /></Link> : <span></span>;
                  return (
                    <div key={list.id} className="grid grid-cols-[1fr_1rem_1rem] items-center gap-1">
                      <FieldLabel htmlFor={domId}>
                        <Field orientation="horizontal">
                          <FieldContent>
                            <FieldTitle>{list.title}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem value={list.id} id={domId} />
                        </Field>
                      </FieldLabel>
                      {Home}
                      {Github}
                    </div>
                  );
                })}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="bg-transparent! border-none" value="assets">
            <AccordionTrigger>アセット</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-0.5">
                {assetCssLists.map((list) => {
                  const domId = `css-asset-${list.id}`;
                  const Home = list.homepageUrl ? <Link href={list.homepageUrl}><FaHome className="size-4" /></Link> : <span></span>;
                  const Github = list.cssUrl ? <Link href={list.cssUrl}><FaGithub className="size-4" /></Link> : <span></span>;
                  return (
                    <div key={list.id} className="grid grid-cols-[1fr_1rem_1rem] items-center gap-1">
                    <FieldLabel htmlFor={domId} key={list.id}>
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>{list.title}</FieldTitle>
                        </FieldContent>
                        <Checkbox
                          id={domId}
                          checked={assetCssIds.includes(list.id)}
                          onCheckedChange={(checked) => {
                            setAssetCssIds(
                              checked
                                ? [...assetCssIds, list.id]
                                : assetCssIds.filter((id) => id !== list.id),
                            );
                          }}
                        />
                      </Field>
                      </FieldLabel>
                      {Home}
                      {Github}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </nav>
  );
}
