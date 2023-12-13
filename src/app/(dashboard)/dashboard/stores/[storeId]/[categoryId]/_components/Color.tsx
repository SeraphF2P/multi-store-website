"use client";
import { FC } from "react";
import { Btn, BtnProps, ConfirmModale, Icons, Input, Modale } from "~/ui";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { RouterInputs } from "~/trpc/shared";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ZOD from "~/lib/zodValidators";
import { toast } from "../../../../../../../lib/myToast";
type ColorCreateRouteType = RouterInputs["color"]["create"];
interface ColorCreateProps {
  categoryId: string;
}

export const create: FC<ColorCreateProps> = ({ categoryId }) => {
  const router = useRouter();
  const { mutate } = api.color.create.useMutation({
    onSuccess: () => {
      toast({ type: "success", message: "color added successfully" });
      router.refresh();
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ColorCreateRouteType>({
    resolver: zodResolver(ZOD.color.create),
  });
  return (
    <Modale>
      <Modale.Btn>add color</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">add color</h2>
          <form
            className=" flex flex-col gap-2"
            onSubmit={handleSubmit((values) => mutate(values))}
          >
            <Input
              errorMSG={errors.name?.message}
              {...register("name")}
              label="name"
              type="text"
            />
            <Input
              errorMSG={errors.value?.message}
              {...register("value")}
              label="color"
              type="color"
            />
            <input
              {...register("categoryId")}
              value={categoryId}
              type="hidden"
            />
            <div className=" flex justify-between">
              <Modale.Close variant="ghost">close</Modale.Close>
              <Btn disabled={isSubmitting} type="submit">
                submit
              </Btn>
            </div>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};

type ColorEditRouteType = RouterInputs["color"]["edit"];
interface ColorEditProps
  extends Omit<Omit<BtnProps, "name">, "value">,
    ColorEditRouteType {}
export const edit: FC<ColorEditProps> = ({
  colorId,
  name,
  value,
  ...props
}) => {
  const router = useRouter();
  const { mutate } = api.color.edit.useMutation({
    onSuccess: () => {
      toast({ type: "success", message: "color added successfully" });
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const { mutate: remove } = api.color.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ColorEditRouteType>({
    values: {
      colorId,
      name,
      value,
    },
  });

  return (
    <Modale>
      <Modale.Btn {...props} />
      <Modale.Content asChild>
        <div className=" relative space-y-2 rounded bg-theme p-4">
          <div className=" flex items-center justify-between ">
            <h2 className=" ">edit color</h2>
            <ConfirmModale
              title="delete color"
              content="are you sure? you want to delete this color "
              onConfirm={() => remove({ colorId })}
              className="  aspect-square p-2 variant-alert"
            >
              <Icons name="trash" className=" h-6 w-6" />
            </ConfirmModale>
          </div>
          <form
            className=" flex flex-col gap-2"
            onSubmit={handleSubmit((values) => mutate(values))}
          >
            <Input
              errorMSG={errors.name?.message}
              {...register("name")}
              label="name"
              type="text"
            />
            <Input
              errorMSG={errors.value?.message}
              {...register("value")}
              label="color"
              type="color"
            />
            <div className=" flex justify-between">
              <Modale.Close variant="ghost">close</Modale.Close>

              <Btn disabled={isSubmitting} type="submit">
                submit
              </Btn>
            </div>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};
