import Link from "next/link";

export function SectionTitle({
  bold,
  light,
  seeAllHref,
}: {
  bold: string;
  light?: string;
  seeAllHref?: string;
}) {
  return (
    <div className="mb-[30px] flex items-center justify-between">
      <h2 className="text-[22px] text-[#1a1a1f]">
        <span className="font-semibold">{bold}</span>
        {light && <span className="font-normal text-[#3a3a44]"> {light}</span>}
      </h2>
      {seeAllHref && (
        <Link href={seeAllHref} className="text-[12px] font-semibold">
          See all
        </Link>
      )}
    </div>
  );
}
