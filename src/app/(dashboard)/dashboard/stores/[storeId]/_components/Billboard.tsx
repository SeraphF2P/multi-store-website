"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "~/lib/myToast";
import { Validator } from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { Btn, BtnProps, ConfirmModale, Input, Modale } from "~/ui";
import UploadCoverImage from "./UploadImagePreview";
interface BillboardCreateFormType
  extends Omit<RouterInputs["billboard"]["create"], "image"> {
  image: FileList;
}

interface BillboardModaleFormProps extends BtnProps {
  storeId: string;
  categoryId: string;
  imageName?: string;
  imagePath?: string;
  label?: string;
  name?: string;
}

export const create = ({
  storeId,
  categoryId,
  ...props
}: Omit<BillboardModaleFormProps, "submitHandler">) => {
  const router = useRouter();
  const { mutate } = api.billboard.create.useMutation({
    onSuccess: () => {
      toast({ message: "billboard created successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: BillboardCreateFormType) => {
    const file = values.image[0];
    const validData = Validator.image.parse(file);
    const data = new FormData();
    data.set("image", validData);
    data.set("storeId", values.storeId);
    await axios
      .post<{ imageName: string }>("/api/uploadImageToStore", data)
      .then((res) => {
        if (!res.data.imageName) return;
        mutate({
          ...values,
          imageName: res.data.imageName,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const { handleSubmit, register } = useForm<BillboardCreateFormType>();

  return (
    <Modale>
      <Modale.Btn {...props}>add billboard</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">create new billboard</h2>
          <form
            className=" flex flex-col gap-2"
            encType="multipart/form-data"
            method="POST"
            onSubmit={handleSubmit(submitHandler)}
          >
            <Input label="billboard label" {...register("label")} />
            <UploadCoverImage
              accept="image/*"
              type="file"
              {...register("image")}
            />
            <input value={storeId} {...register("storeId")} type="hidden" />
            <input
              value={categoryId}
              {...register("categoryId")}
              type="hidden"
            />
            <Btn type="submit">Submit</Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};
interface BillboardEditFormType
  extends Omit<RouterInputs["billboard"]["edit"], "image">,
    BtnProps {
  imagePath: string;
  storeId: string;
}
export const edit = ({
  billboardId,
  storeId,
  children,
  imageName,
  imagePath,
  label,
  ...props
}: BillboardEditFormType) => {
  const router = useRouter();
  const { mutate } = api.billboard.edit.useMutation({
    onSuccess: () => {
      toast({ message: "billboard edited successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });

  const submitHandler = async (values: BillboardCreateFormType) => {
    const file = values.image[0];
    const validData = Validator.image.parse(file);
    const data = new FormData();
    data.set("image", validData);
    data.set("storeId", storeId);
    if (imagePath == undefined || imageName == undefined) return;
    await axios
      .post("/api/uploadImageToStore", data)
      .then((res) => {
        if (!res.data) return;
        const newImageName = res.data.imageName || null;
        if (!newImageName) return;

        mutate({
          ...values,
          imageName: newImageName,
          billboardId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const { handleSubmit, register } = useForm<BillboardCreateFormType>({
    defaultValues: {
      imageName,
      label,
    },
  });
  return (
    <Modale>
      <Modale.Btn {...props}>edit</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">edit billboard</h2>
          <form
            className=" flex flex-col gap-2"
            encType="multipart/form-data"
            method="POST"
            onSubmit={handleSubmit(submitHandler)}
          >
            <Input label="billboard label" {...register("label")} />
            <UploadCoverImage
              accept="image/*"
              type="file"
              imageName={imageName}
              imagePath={imagePath}
              {...register("image")}
            />
            <input value={storeId} {...register("storeId")} type="hidden" />
            <Btn type="submit">Submit</Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};
type BillboardDelete = RouterInputs["billboard"]["delete"];
interface BillboardDeleteComponent extends BillboardDelete {
  label: string;
}

export const remove = ({
  billboardId,
  label,
  ...props
}: BillboardDeleteComponent) => {
  const router = useRouter();
  const { mutate } = api.billboard.delete.useMutation({
    onSuccess: () => {
      toast({ message: "billboard deleted successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });

  return (
    <ConfirmModale
      title={`delete ${label} billboard`}
      className=" variant-alert"
      content="Are you sure you want to delete this billboard ,this action cannot be undone"
      onConfirm={() => mutate({ billboardId })}
    >
      delete
    </ConfirmModale>
  );
};
