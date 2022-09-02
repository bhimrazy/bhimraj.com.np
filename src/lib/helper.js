import settings from "@/components/seo/settings";
import { useRouter } from "next/router";

export const useSiteUrl = () => {
    const router = useRouter();
    return settings?.meta?.rootUrl + router.asPath || "";
};
