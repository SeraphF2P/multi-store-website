import Link, { LinkProps } from "next/link";
import { FC, ReactNode } from "react";
import { cn, variantsType, variants } from "~/lib/cva";

interface NextLinkProps extends LinkProps, variantsType {
  className?: string;
  children: ReactNode;
}

const NextLink: FC<NextLinkProps> = ({
  className,
  variant,
  shape,
  deActivated,
  ...props
}) => {
  return (
    <Link
      className={cn(
        variants({
          variant: variant || "none",
          shape,
          deActivated,
        }),
        className,
      )}
      {...props}
    />
  );
};

export default NextLink;
