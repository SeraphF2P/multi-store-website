import { cn } from "~/lib/cva";
import Image, { type ImageProps } from "next/image";
import type { ElementType, FC } from "react";

interface NextImageProps extends ImageProps {
  className?: string;
  wrapperClassName?: string;
  resoloution?: { w: number; h: number };
  wrapper?: ElementType;
  sizes: string;
}

const NextImage: FC<NextImageProps> = ({
  className,
  wrapperClassName,
  wrapper = "div",
  sizes,
  ...props
}) => {
  const Component = wrapper;
  return (
    <Component className={cn("relative", wrapperClassName)}>
      <Image
        className={cn("absolute inset-0 object-cover ", className)}
        fill
        sizes={sizes}
        {...props}
        alt={props.alt}
      />
    </Component>
  );
};

export default NextImage;
