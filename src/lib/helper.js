import settings from "@/components/seo/settings";
import { useRouter } from "next/router";

export const getSiteUrl = () => {
    const router = useRouter();
    return settings?.meta?.rootUrl + router.asPath || "";
};
