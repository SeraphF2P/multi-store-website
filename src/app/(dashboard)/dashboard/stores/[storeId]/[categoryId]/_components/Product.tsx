"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color, Size } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  Select,
  Switch,
  UploadImagePreview,
} from "~/ui";
import { toFilePath } from "~/helpers/utile";

type ProductCreateFormType = z.infer<typeof ZOD.product.create>;

interface ProductModaleFormProps extends BtnProps {
  storeId: string;
  categoryId: string;
  groupId?: number;
  imageName?: string;
  imagePath?: string;
  label?: string;
  name?: string;
  colors: Color[];
  sizes: Size[];
}

export const create = ({
  storeId,
  categoryId,
  colors,
  sizes,
  groupId,
  ...props
}: ProductModaleFormProps) => {
  const router = useRouter();
  const { mutate } = api.product.create.useMutation({
    onSuccess: () => {
      toast({ message: "product created successfully", type: "success" });
      router.refresh();
    },
    onError: (err) => {
      if (err.shape?.data?.zodError) {
        const zodErrors = JSON.parse(err.shape.message);
        const errorMessage = zodErrors[0].message || "Validation error";
        toast({
          message: errorMessage,
          type: "error",
        });
      } else {
        toast({
          message: "Something went wrong. Please try again later.",
          type: "error",
        });
      }
    },
  });
  const submitHandler = async ({ image, ...values }: ProductCreateFormType) => {
    const data = new FormData();
    data.set("image", image[0]);
    data.set("storeId", values.storeId);
    await axios
      .post<{ imageName: string }>("/api/uploadImageToStore", data)
      .then((res) => {
        if (!res.data.imageName) return;
        mutate({
          ...values,
          imageName: res.data.imageName,
          groupId,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProductCreateFormType>({
    defaultValues: {
      categoryId,
      storeId,
    },
    resolver: zodResolver(ZOD.product.create),
  });

  return (
    <Modale>
      <Modale.Btn {...props}>add product</Modale.Btn>
      <Modale.Content asChild>
        <div className=" relative  rounded bg-theme  p-4">
          <h2 className=" pb-2">create new product</h2>
          <form
            className=" relative flex flex-col gap-2"
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
              errorMSG={errors.price?.message}
              label="price"
              inputMode="decimal"
              type="number"
              {...register("price", {
                valueAsNumber: true,
              })}
            />
            <Select.root
              onSelectChange={({ value }) => setValue("colorId", value)}
              errorMSG={errors.colorId?.message}
              className=" w-full"
              placeholder="select a color"
              {...register("colorId")}
            >
              <Select.trigger variant="ghost" />
              <Select.overlayer />
              <Select.content className=" absolute -top-1/2 left-0 z-50 max-h-80 w-full gap-0.5 overflow-y-scroll  rounded bg-white p-1">
                {colors &&
                  colors.map((color) => {
                    return (
                      <Select.item
                        style={
                          {
                            "--select-color": `${color.value}`,
                            "--select-color-hover": `${color.value}aa`,
                          } as CSSProperties
                        }
                        key={color.id}
                        name={color.name}
                        value={color.id}
                        className=" w-full bg-[var(--select-color)]  p-2  capitalize text-border  hover:bg-[var(--select-color-hover)]"
                      >
                        {color.name}
                      </Select.item>
                    );
                  })}
              </Select.content>
            </Select.root>
            <Select.root
              onSelectChange={({ value }) => setValue("sizeId", value)}
              errorMSG={errors.sizeId?.message}
              className=" w-full"
              placeholder="select a size"
              {...register("sizeId")}
            >
              <Select.trigger variant="ghost" />
              <Select.overlayer />
              <Select.content className=" absolute -top-1/2 left-0 z-50 max-h-80 w-full gap-0.5 overflow-y-scroll  rounded bg-white p-1">
                {sizes &&
                  sizes.map((size) => {
                    return (
                      <Select.item
                        key={size.id}
                        name={size.name}
                        value={size.id}
                        className=" w-full bg-theme  p-2  capitalize text-border  hover:bg-theme/70"
                      >
                        {size.name}
                      </Select.item>
                    );
                  })}
              </Select.content>
            </Select.root>
            <div className=" p-1">
              <Switch
                label="featured"
                {...register("isFeatured", {
                  setValueAs: (value) => {
                    return value === "on";
                  },
                })}
              />
            </div>

            <UploadImagePreview
              errorMSG={errors.image?.message?.toString()}
              accept="image/*"
              {...register("image")}
              type="file"
            />
            <input type="hidden" value={storeId} {...register("storeId")} />
            <input
              type="hidden"
              value={categoryId}
              {...register("categoryId")}
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

type ProductEditFormType = z.infer<typeof ZOD.product.edit>;
interface ProductEditFormProps extends Omit<BtnProps, "name"> {
  colors: Color[];
  sizes: Size[];
  product: ProductEditFormType & {
    color: {
      id: string;
      name: string;
      value: string;
    };
    size: {
      id: string;
      name: string;
      value: string;
    };
  };
}
export const edit = ({
  children,
  colors,
  sizes,
  product,
  ...props
}: ProductEditFormProps) => {
  const router = useRouter();
  const { mutate } = api.product.edit.useMutation({
    onSuccess: () => {
      toast({ message: "product edited successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ProductEditFormType>({
    defaultValues: {
      colorId: product.color.id,
      sizeId: product.size.id,
      productId: product.productId,
      storeId: product.storeId,
      isFeatured: product.isFeatured,
      name: product.name,
      price: product.price,
    },
    resolver: zodResolver(ZOD.product.edit),
  });

  const submitHandler = async (values: ProductEditFormType) => {
    const data = new FormData();
    let newImageName;
    if (values.image && values.image[0]) {
      data.set("image", values.image[0]);
      data.set("storeId", values.storeId);
      const res = await axios.post<{ imageName: string }>(
        "/api/uploadImageToStore",
        data,
      );
      newImageName = res.data?.imageName;
      if (!newImageName)
        return toast({
          type: "error",
          message: "something went wrong try again later",
        });
    }
    mutate({
      ...values,
      ...(newImageName ? { imageName: newImageName } : []),
    });
  };
  return (
    <Modale>
      <Modale.Btn {...props}>edit</Modale.Btn>
      <Modale.Content asChild>
        <div className=" relative  rounded bg-theme  p-4">
          <h2 className=" pb-2">edit product</h2>
          <form
            className=" relative flex flex-col gap-2"
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
              errorMSG={errors.price?.message}
              label="price"
              {...register("price", {
                valueAsNumber: true,
              })}
              type="number"
            />
            <Select.root
              errorMSG={errors.colorId?.message}
              onSelectChange={({ value }) => setValue("colorId", value)}
              className=" w-full"
              placeholder={product.color.name}
              {...register("colorId")}
            >
              <Select.trigger variant="ghost" />
              <Select.overlayer />
              <Select.content className=" absolute -top-1/2 left-0 z-50 max-h-80 w-full gap-0.5 overflow-y-scroll  rounded bg-white p-1">
                {colors &&
                  colors.map((color) => {
                    return (
                      <Select.item
                        style={
                          {
                            "--select-color": `${color.value}`,
                            "--select-color-hover": `${color.value}aa`,
                          } as CSSProperties
                        }
                        key={color.id}
                        name={color.name}
                        value={color.id}
                        className=" w-full bg-[var(--select-color)]  p-2  capitalize text-border  hover:bg-[var(--select-color-hover)]"
                      >
                        {color.name}
                      </Select.item>
                    );
                  })}
              </Select.content>
            </Select.root>
            <Select.root
              errorMSG={errors.sizeId?.message}
              onSelectChange={({ value }) => setValue("sizeId", value)}
              placeholder={product.size.name}
              className=" w-full"
              {...register("sizeId")}
            >
              <Select.trigger variant="ghost" />
              <Select.overlayer />
              <Select.content className=" absolute -top-1/2 left-0 z-50 max-h-80 w-full gap-0.5 overflow-y-scroll  rounded bg-white p-1">
                {sizes &&
                  sizes.map((size) => {
                    return (
                      <Select.item
                        key={size.id}
                        name={size.name}
                        value={size.id}
                        className=" w-full bg-theme  p-2  capitalize text-border  hover:bg-theme/70"
                      >
                        {size.name}
                      </Select.item>
                    );
                  })}
              </Select.content>
            </Select.root>
            <div className=" p-1">
              <Switch
                label="featured"
                defaultChecked={product.isFeatured}
                {...register("isFeatured", {
                  setValueAs: (val) => val === "on",
                })}
              />
            </div>
            <UploadImagePreview
              errorMSG={errors.image?.message?.toString()}
              previewSrc={toFilePath(
                `/stores/${product.storeId}/` + product.image.imageName,
              )}
              {...register("image")}
            />
            <input
              type="hidden"
              value={product.storeId}
              {...register("storeId")}
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
type ProductDelete = RouterInputs["product"]["delete"];
interface ProductDeleteComponent extends ProductDelete, BtnProps {
  label: string;
}

export const remove = ({
  productId,
  label,
  ...props
}: ProductDeleteComponent) => {
  const router = useRouter();
  const { mutate } = api.product.delete.useMutation({
    onSuccess: () => {
      toast({ message: "product deleted successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });

  return (
    <ConfirmModale
      title={`delete ${label} product`}
      {...props}
      content="Are you sure you want to delete this product ,this action cannot be undone"
      onConfirm={() => mutate({ productId })}
    >
      delete
    </ConfirmModale>
  );
};
