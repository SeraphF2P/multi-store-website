import { FC } from "react";
import Icons from "./Icons";

interface NoContentProps {
  caption?: string;
}

const NoContent: FC<NoContentProps> = ({
  caption = "no content available",
}) => {
  return (
    <div className=" m-auto  flex aspect-video h-full w-[calc(100%_-_64px)] max-w-xs flex-col items-center justify-center gap-2 rounded  bg-gray-500 shadow-sm">
      <Icons name="info" className="  h-1/2 w-1/2" />
      <p>{caption}</p>
    </div>
  );
};

export default NoContent;
