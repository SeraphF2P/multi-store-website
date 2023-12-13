"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "~/lib/myToast";
import * as ZOD from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import {
  Btn,
  BtnProps,
  ConfirmModale,
  Input,
  Modale,
  UploadImagePreview,
} from "~/ui";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toFilePath } from "../../../../../../helpers/utile";
type BillboardCreateFormType = z.infer<typeof ZOD.billboard.create>;

interface BillboardModaleCreateFormProps extends BtnProps {
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
}: BillboardModaleCreateFormProps) => {
  const router = useRouter();
  const { mutate } = api.billboard.create.useMutation({
    onSuccess: () => {
      toast({ message: "billboard created successfully", type: "success" });
      reset();
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: BillboardCreateFormType) => {
    const data = new FormData();
    data.set("image", values.image[0]);
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
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BillboardCreateFormType>({
    resolver: zodResolver(ZOD.billboard.create),
  });
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
            <Input
              errorMSG={errors.label?.message}
              label="billboard label"
              {...register("label")}
            />
            <UploadImagePreview
              accept="image/*"
              type="file"
              {...register("image")}
              errorMSG={errors.image?.message?.toString()}
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
type BillboardEditFormType = z.infer<typeof ZOD.billboard.edit>;

interface BillboardModaleEditFormProps extends BillboardEditFormType, BtnProps {
  imagePath: string;
  imageName: string;
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
}: BillboardModaleEditFormProps) => {
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

  const submitHandler = async (values: BillboardEditFormType) => {
    let newImageName;
    if (values.image && values.image[0]) {
      const data = new FormData();
      data.set("image", values.image[0]);
      data.set("storeId", storeId);
      const res = await axios.post("/api/uploadImageToStore", data);
      if (!res.data.imageName)
        return toast({
          type: "error",
          message: "something went wrong try again later",
        });

      newImageName = res.data.imageName;
    }
    if (!values.image[0] && values.label === label)
      return toast({
        type: "warn",
        message: "you didn't change anythings to save",
      });
    mutate({
      ...values,
      imageName: newImageName,
    });
  };
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<BillboardEditFormType>({
    defaultValues: {
      label,
    },
    resolver: zodResolver(ZOD.billboard.edit),
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
            <UploadImagePreview
              errorMSG={errors.image?.message?.toString()}
              previewSrc={toFilePath(`/stores/${storeId}/` + imageName)}
              {...register("image")}
            />
            <input
              value={billboardId}
              {...register("billboardId")}
              type="hidden"
            />
            <Btn disabled={isSubmitting} type="submit">
              Submit
            </Btn>
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
      {...props}
    >
      delete
    </ConfirmModale>
  );
};
