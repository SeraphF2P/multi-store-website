"use client";
import { FC } from "react";
import { Btn, BtnProps, ConfirmModale, Icons, Input, Modale, NextImage } from "~/ui";
import { api } from "~/trpc/react";
import { useForm } from "react-hook-form";
import { RouterInputs } from "~/trpc/shared";
import { useRouter } from "next/navigation";

type SizeCreateRouteType = RouterInputs["size"]["create"];
interface SizeCreateProps {
  categoryId: string;
}

export const create: FC<SizeCreateProps> = ({ categoryId }) => {
  const router = useRouter();
  const { mutate } = api.size.create.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  const form = useForm<SizeCreateRouteType>();
  return (
    <Modale>
      <Modale.Btn>add size</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">add size</h2>
          <form
            className=" flex flex-col gap-2"
            onSubmit={form.handleSubmit((values) => mutate(values))}
          >
            <Input {...form.register("name")} label="name" type="text" />
            <Input {...form.register("value")} label="size" type="text" />
            <input
              {...form.register("categoryId")}
              value={categoryId}
              type="hidden"
            />
            <div className=" flex justify-between">
              <Modale.Close variant="ghost">close</Modale.Close>
              <Btn type="submit">submit</Btn>
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
  const form = useForm<SizeEditRouteType>({
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
            onSubmit={form.handleSubmit((values) => mutate(values))}
          >
            <Input {...form.register("name")} label="name" type="text" />
            <Input {...form.register("value")} label="size" type="text" />
            <div className=" flex justify-between">
              <Modale.Close variant="ghost">close</Modale.Close>

              <Btn type="submit">submit</Btn>
            </div>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};

