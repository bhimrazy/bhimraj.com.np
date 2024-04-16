import { SiteInfo } from "@/lib/types";
import Image from "next/image";

export default function Logo() {
  const LOGO_URL = "/logo.png"
  const WHITE_LOGO_URL = "/logo-white.png"
  return (
    <>
      <div className="relative h-8 w-32 transition dark:hidden">
        <Image
          className="h-full w-full object-cover"
          src={LOGO_URL}
          width={509}
          height={128}
          alt="Logo"
          title="Logo"
        />
      </div>
      <div className="relative hidden h-8 w-32 transition  dark:block">
        <Image
          className="h-full w-full object-cover"
          src={WHITE_LOGO_URL}
          width={509}
          height={128}
          alt="Logo"
          title="Logo"
        />
      </div>
    </>
  );
}
