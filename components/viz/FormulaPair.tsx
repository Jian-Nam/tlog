import { Tex } from "@/components/Tex";

/** 같은 연립방정식의 두 가지 표현을 나란히(또는 위아래로) 보여줌 */
export function FormulaPair({
  items,
  layout = "stack",
}: {
  items: { label: string; tex: string }[];
  layout?: "stack" | "row";
}) {
  return (
    <div className={layout === "row" ? "grid gap-3 md:grid-cols-2" : "flex flex-col gap-3"}>
      {items.map((it) => (
        <div key={it.label} className="eq-tight min-w-0 rounded-lg bg-surface-2 px-3 pb-3 pt-2">
          <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-muted">{it.label}</div>
          <Tex block>{it.tex}</Tex>
        </div>
      ))}
    </div>
  );
}
