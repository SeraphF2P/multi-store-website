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
type SizeCreateRouteType = RouterInputs["size"]["create"];
interface SizeCreateProps {
  categoryId: string;
}

export const create: FC<SizeCreateProps> = ({ categoryId }) => {
  const router = useRouter();
  const { mutate } = api.size.create.useMutation({
    onSuccess: () => {
      toast({ type: "success", message: "size added successfully" });
      router.refresh();
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SizeCreateRouteType>({
    resolver: zodResolver(ZOD.size.create),
  });
  return (
    <Modale>
      <Modale.Btn>add size</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">add size</h2>
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
              label="size"
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

type SizeEditRouteType = RouterInputs["size"]["edit"];
interface SizeEditProps
  extends Omit<Omit<BtnProps, "name">, "value">,
    SizeEditRouteType {}
export const edit: FC<SizeEditProps> = ({ sizeId, name, value, ...props }) => {
  const router = useRouter();
  const { mutate } = api.size.edit.useMutation({
    onSuccess: () => {
      toast({ type: "success", message: "size added successfully" });
      router.refresh();
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const { mutate: remove } = api.size.delete.useMutation({
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
  } = useForm<SizeEditRouteType>({
    values: {
      sizeId,
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
            <h2 className=" ">edit size</h2>
            <ConfirmModale
              title="delete size"
              content="are you sure? you want to delete this size "
              onConfirm={() => remove({ sizeId })}
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
              label="size"
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
