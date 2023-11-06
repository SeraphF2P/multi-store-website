import { User } from "@prisma/client";

export const filterUser = (user: User) => {
  const { image, ...rest } = user;

  return {
    image: image ?? "public/user-image-placeholder.png",
    ...rest,
  };
};
