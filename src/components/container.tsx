import { cn } from "@/lib/utils";
import React from "react";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

const Container: React.FC<ContainerProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("container max-w-screen-lg", className)} {...props}>
      {children}
    </div>
  );
};

export default Container;
