import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { siteConfig } from "@/config/site";

export function AvatarIcon() {
  return (
    <Avatar className="h-6 w-6">
      <AvatarImage
        src={siteConfig.author.avatar}
        alt={siteConfig.author.name}
      />
      <AvatarFallback>BR</AvatarFallback>
    </Avatar>
  );
}
