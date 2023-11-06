"use client";
import { useForm } from "react-hook-form";
import { Btn, Input, Modale } from "~/ui";
import { RouterInputs } from "~/trpc/shared";
import { api } from "~/trpc/react";
import { toast } from "~/lib/myToast";

type FormProps = RouterInputs["store"]["create"];
const CreateStoreModaleBtn = () => {
  const { handleSubmit, register } = useForm<FormProps>();
  const { mutate } = api.store.create.useMutation({
    onError: () => {
      toast({ message: "store name already exists", type: "error" });
    },
    onSuccess: () => {
      toast({ message: "store created successfuly", type: "success" });
    },
  });
  const submitHandler = (values: FormProps) => {
    mutate(values);
  };
  return (
    <Modale>
      <Modale.Btn>create store</Modale.Btn>
      <Modale.Content asChild>
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="rounded bg-theme p-2 "
        >
          <Input
            label="name"
            {...register("name", {
              required: true,
            })}
          />
          <Btn type="submit">submit</Btn>
        </form>
      </Modale.Content>
    </Modale>
  );
};

export default CreateStoreModaleBtn;
