"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "~/lib/myToast";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { Btn, BtnProps, ConfirmModale, Input, Modale } from "~/ui";

type FormProps = RouterInputs["store"]["create"];
export const create = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<FormProps>();
  const FormRef = useRef<HTMLFormElement>(null);
  const { mutate } = api.store.create.useMutation({
    onSuccess: () => {
      toast({ message: "store created successfuly", type: "success" });
      router.refresh();
    },
    onError: (err) => {
      toast({ message: err.message, type: "error" });
    },
  });
  const submitHandler = (values: FormProps) => {
    mutate(values);
  };
  return (
    <Modale>
      <Modale.Btn className=" capitalize">create store</Modale.Btn>
      <Modale.Content asChild>
        <div className=" space-y-4 rounded bg-theme p-4 text-center ">
          <h2 className="p-2">create new store</h2>
          <form
            ref={FormRef}
            onSubmit={handleSubmit(submitHandler)}
            className=" space-y-4"
          >
            <Input
              label="name"
              {...register("name", {
                required: true,
              })}
            />
            <p>other customizetion well be added later</p>
            <Btn className=" w-full capitalize" type="submit">
              submit
            </Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};
type StoreEditType = RouterInputs["store"]["edit"];
export const edit = ({ name, storeId, ...props }: StoreEditType & BtnProps) => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<StoreEditType>({
    defaultValues: {
      name,
      storeId,
    },
  });
  const { mutate } = api.store.edit.useMutation({
    onError: () => {
      toast({ message: "something went wrong", type: "error" });
    },
    onSuccess: () => {
      router.refresh();
      toast({ message: "store edited successfuly", type: "success" });
    },
  });

  return (
    <Modale>
      <Modale.Btn {...props}>edit</Modale.Btn>
      <Modale.Content asChild>
        <div className=" space-y-4 rounded bg-theme p-4 text-center ">
          <h2 className="p-2">edit store</h2>
          <form
            onSubmit={handleSubmit((values) => mutate(values))}
            className=" space-y-4"
          >
            <Input
              label="name"
              {...register("name", {
                required: true,
              })}
            />
            <input type="hidden" {...register("storeId")} />
            <Btn className=" w-full capitalize" type="submit">
              submit
            </Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};

export const remove = ({
  storeId,
  name,
  ...props
}: { name: string; storeId: string } & BtnProps) => {
  const router = useRouter();
  const { mutate } = api.store.delete.useMutation({
    onError: () => {
      toast({ message: "something went wrong", type: "error" });
    },
    onSuccess: () => {
      toast({ message: "store edited successfuly", type: "success" });
      router.refresh();
    },
  });

  return (
    <ConfirmModale
      {...props}
      title={`delete ${name} store`}
      content="Are you sure you want to delete this store , this action cannot be undone"
      onConfirm={() => mutate({ storeId })}
    >
      delete
    </ConfirmModale>
  );
};
