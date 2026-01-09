import type React from "react";
import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("container max-w-(--breakpoint-lg)", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
