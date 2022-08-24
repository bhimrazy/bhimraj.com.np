import { SiteInfo } from "@/lib/types";
import Image from "next/image";

export default function Logo({ site_info }: { site_info: SiteInfo }) {
  return (
    <>
      <div className="relative h-8 w-32 transition dark:hidden">
        <Image
          className="hidden h-full w-full object-cover"
          src={site_info?.logo}
          layout="fill"
        />
      </div>
      <div className="relative hidden h-8 w-32 transition  dark:block">
        <Image
          className="h-full w-full object-cover"
          src={site_info?.logo_white}
          layout="fill"
        />
      </div>
    </>
  );
}
