"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "~/lib/myToast";
import { Validator } from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { Btn, BtnProps, ConfirmModale, Input, Modale } from "~/ui";
import UploadCoverImage from "./UploadImagePreview";
interface CategoryFormType
  extends Omit<RouterInputs["category"]["create"], "image"> {
  image: FileList;
}
interface CategoryModaleFormProps extends BtnProps {
  storeId: string;
  imageName?: string;
  imagePath?: string;
  label?: string;
  name?: string;
  submitHandler: SubmitHandler<CategoryFormType>;
}

export const create = ({
  storeId,
  children,
  ...props
}: Omit<CategoryModaleFormProps, "submitHandler">) => {
  const router = useRouter();
  const { mutate } = api.category.create.useMutation({
    onSuccess: () => {
      router.refresh();
      toast({ message: "category created successfully", type: "success" });
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: CategoryFormType) => {
    const file = values.image[0];
    const validData = Validator.image.parse(file);
    const data = new FormData();
    data.set("image", validData);
    data.set("storeId", values.storeId);
    await axios
      .post<{ imageName: string }>("/api/uploadImageToStore", data)
      .then((res) => {
        if (!res) return;
        mutate({
          ...values,
          imageName: res.data.imageName,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const { handleSubmit, register } = useForm<CategoryFormType>();
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
              <Input label="name" {...register("name")} />
              <Input label="billboard label" {...register("label")} />
              <UploadCoverImage
                accept="image/*"
                type="file"
                {...register("image")}
              />
              <input value={storeId} {...register("storeId")} type="hidden" />
              <Btn type="submit">Submit</Btn>
            </form>
          </div>
        </Modale.Content>
      </Modale>
    </>
  );
};
export const edit = ({
  categoryId,
  name,
  ...props
}: BtnProps & {
  categoryId: string;
  name: string;
}) => {
  const ctx = api.useContext();
  const { mutate } = api.category.edit.useMutation({
    onSuccess: () => {
      toast({ message: "category edited successfully", type: "success" });
      window.location.reload();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: {
    name: string;
    categoryId: string;
  }) => {
    mutate(values);
  };
  const { handleSubmit, register } = useForm<{
    name: string;
    categoryId: string;
  }>({
    defaultValues: {
      name,
    },
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
            onSubmit={handleSubmit(submitHandler)}
          >
            <Input label="name" {...register("name")} />
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
interface DeleteCategoryBtnProps extends BtnProps {
  category: {
    name: string;
    id: string;
  };
}

export const remove = ({ category, ...props }: DeleteCategoryBtnProps) => {
  const deleteCateory = api.category.delete.useMutation();
  const router = useRouter();
  return (
    <ConfirmModale
      {...props}
      title={`delete ${category.name} permintly`}
      className="variant-alert capitalize"
      content="are you sure you want to delete this category ? all its informition will be lost"
      onConfirm={async () => {
        deleteCateory.mutate({
          categoryId: category.id,
        });
        router.refresh();
      }}
    >
      delete
    </ConfirmModale>
  );
};
