import { ComponentProps, FC } from "react";
import Icons from "./Icons";
import NextImage from "./NextImage";
const Star = () => {
  const randomizer = [8, 16, 32][Math.floor(Math.random() * 3)];

  const XRandomizer = Math.random() * 100;
  const YRandomizer = Math.random() * 100;
  const dir = Math.random() > 0.5 ? 1 : -1;
  return (
    <Icons
      name="star"
      style={{
        translate: `${XRandomizer + "%"} ${YRandomizer + "%"}`,
        width: `${randomizer + "px"}`,
        height: `${randomizer + "px"}`,
        rotate: `${(randomizer || 0) * dir + "deg"}`,
      }}
      // className=" animate-buzz"
    />
  );
};
const StaryNightPage = (props: ComponentProps<"div">) => {
  const emtyArray = Array.from({ length: 200 });
  return (
    <div className=" fixed inset-0 z-50 overflow-hidden  bg-theme">
      <div className="grid h-full w-full grid-cols-[repeat(auto-fit,40px)] grid-rows-[repeat(auto-fit,40px)]  bg-theme">
        {emtyArray.map((_, index) => (
          <Star key={index} />
        ))}
        <NextImage
          className=" animate-[spin_4s_linear_infinite] [scale:1.5] "
          wrapperClassName="fixed left-[calc(50%_-_80px)] overflow-hidden rounded-full  bg-red-500 top-[calc(50%_-_80px)] h-40 w-40"
          src={"/logo-image.jpg"}
          alt="logo"
        />
      </div>
    </div>
  );
};
const loadings = {
  StaryNightPage,
};
interface LoadingProps extends ComponentProps<"div"> {
  name: keyof typeof loadings;
}

const Loading: FC<LoadingProps> = ({ name }) => {
  const Component = loadings[name];
  return <Component />;
};

export default Loading;
