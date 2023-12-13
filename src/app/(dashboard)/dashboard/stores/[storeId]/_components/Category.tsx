"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "~/lib/myToast";
import * as ZOD from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import {
  Btn,
  BtnProps,
  ConfirmModale,
  Input,
  Modale,
  UploadImagePreview,
} from "~/ui";
import { cn } from "~/lib/cva";

type CategoryCreateFormType = z.infer<typeof ZOD.category.create>;

interface CategoryModaleFormProps extends BtnProps {
  storeId: string;
  imageName?: string;
  imagePath?: string;
  label?: string;
  name?: string;
}

export const create = ({
  storeId,
  children,
  ...props
}: CategoryModaleFormProps) => {
  const router = useRouter();
  const { mutate } = api.category.create.useMutation({
    onSuccess: () => {
      toast({ message: "category created successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: CategoryCreateFormType) => {
    const data = new FormData();
    data.set("image", values.image[0]);
    data.set("storeId", values.storeId);
    await axios
      .post<{ imageName: string }>("/api/uploadImageToStore", data)
      .then((res) => {
        if (!res || !res.data.imageName) return;
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
  } = useForm<CategoryCreateFormType>({
    resolver: zodResolver(ZOD.category.create),
  });
  return (
    <>
      <Modale>
        <Modale.Btn {...props}>{children}</Modale.Btn>
        <Modale.Content asChild>
          <div className=" rounded bg-theme p-4">
            <h2 className=" pb-2">create new category</h2>
            <form
              className=" flex flex-col gap-2"
              encType="multipart/form-data"
              method="POST"
              onSubmit={handleSubmit(submitHandler)}
            >
              <Input
                errorMSG={errors.name?.message}
                label="name"
                {...register("name")}
              />
              <Input
                errorMSG={errors.label?.message}
                label="billboard label"
                {...register("label")}
              />
              <UploadImagePreview
                errorMSG={errors.image?.message?.toString()}
                accept="image/*"
                type="file"
                {...register("image")}
              />
              <input value={storeId} {...register("storeId")} type="hidden" />

              <Btn disabled={isSubmitting} type="submit">
                Submit
              </Btn>
            </form>
          </div>
        </Modale.Content>
      </Modale>
    </>
  );
};

type CategoryEditFormType = z.infer<typeof ZOD.category.edit>;
export const edit = ({
  categoryId,
  name,
  ...props
}: BtnProps & CategoryEditFormType) => {
  const router = useRouter();
  const { mutate } = api.category.edit.useMutation({
    onSuccess: () => {
      toast({ message: "category edited successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<CategoryEditFormType>({
    defaultValues: {
      name,
    },
    resolver: zodResolver(ZOD.category.edit),
  });
  return (
    <Modale>
      <Modale.Btn {...props}> edit</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">edite category</h2>
          <form
            className=" flex flex-col gap-2"
            encType="multipart/form-data"
            method="POST"
            onSubmit={handleSubmit((values) => {
              if (values.name === name)
                return toast({
                  type: "warn",
                  message: "this is the same name as the before",
                });
              mutate(values);
            })}
          >
            <Input
              errorMSG={errors.name?.message}
              label="name"
              {...register("name")}
            />
            <input
              value={categoryId}
              {...register("categoryId")}
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
interface DeleteCategoryBtnProps extends BtnProps {
  category: {
    name: string;
    id: string;
  };
}

export const remove = ({
  category,
  className,
  ...props
}: DeleteCategoryBtnProps) => {
  const { mutate: deleteCateory, isLoading } =
    api.category.delete.useMutation();
  const router = useRouter();
  return (
    <ConfirmModale
      {...props}
      title={`delete ${category.name} permintly`}
      disabled={isLoading}
      className={cn("capitalize variant-alert", className)}
      content="are you sure you want to delete this category ? all its informition will be lost"
      onConfirm={async () => {
        deleteCateory({
          categoryId: category.id,
        });
        router.refresh();
      }}
    >
      delete
    </ConfirmModale>
  );
};
