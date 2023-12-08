"use client";
import { Color, Size } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CSSProperties, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { ZodError } from "zod";
import { toast } from "~/lib/myToast";
import * as ZOD from "~/lib/zodValidators";
import { api } from "~/trpc/react";
import { RouterInputs } from "~/trpc/shared";
import { Btn, BtnProps, ConfirmModale, Input, Modale, Select } from "~/ui";
import UploadCoverImage from "../../_components/UploadImagePreview";

interface ProductCreateFormType
  extends Omit<RouterInputs["product"]["create"], "imageName"> {
  image: File;
}

interface ProductModaleFormProps extends BtnProps {
  storeId: string;
  categoryId: string;
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
  ...props
}: Omit<ProductModaleFormProps, "submitHandler">) => {
  const router = useRouter();
  const { mutate } = api.product.create.useMutation({
    onSuccess: () => {
      toast({ message: "product created successfully", type: "success" });
      router.refresh();
    },
    onError: () => {
      toast({ message: "something went wrong try again later", type: "error" });
    },
  });
  const submitHandler = async (values: ProductCreateFormType) => {
    const data = new FormData();
    data.set("image", values.image);
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
  const { register } = useForm<ProductCreateFormType>({
    defaultValues: {
      categoryId,
      storeId,
    },
  });
  const handleSubmit = (fn: (values: ProductCreateFormType) => void) => {
    return (e: FormEvent) => {
      e.preventDefault();
      try {
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(
          formData.entries(),
        ) as unknown as ProductCreateFormType;
        const validData = ZOD.product.create.safeParse(data);

        if (validData.success) {
          fn(data);
        }
      } catch (error) {
        const err = error as ZodError;
        toast({ type: "error", message: err.errors[0]?.message || "" });
      }
    };
  };
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
            <Input label="name" {...register("name")} />
            <Input
              label="price"
              {...register("price")}
              inputMode="decimal"
              type="number"
            />
            <Select.root className=" w-full" {...register("colorId")}>
              <Select.trigger placeholder="select a color" variant="ghost" />
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
            <Select.root className=" w-full" {...register("sizeId")}>
              <Select.trigger placeholder="select a size" variant="ghost" />
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
            <input type="hidden" value={storeId} {...register("storeId")} />
            <input
              type="hidden"
              value={categoryId}
              {...register("categoryId")}
            />
            <UploadCoverImage
              accept="image/*"
              type="file"
              {...register("image")}
            />
            <Btn type="submit">Submit</Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};

type ProductRouteInput = RouterInputs["product"]["edit"];
interface ProductEditFormType
  extends ProductRouteInput,
    Omit<BtnProps, "name"> {
  imagePath: string;
}
export const edit = ({
  productId,
  categoryId,
  storeId,
  colorId,
  sizeId,
  name,
  price,
  children,
  isArchived,
  isFeatured,
  imagePath,
  ...props
}: ProductEditFormType) => {
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

  const { handleSubmit, register } = useForm<
    ProductRouteInput & { image: FileList }
  >({
    defaultValues: {
      productId,
      categoryId,
      storeId,
      colorId,
      sizeId,
      name,
      price,
      isArchived,
      isFeatured,
    },
  });
  return (
    <Modale>
      <Modale.Btn {...props}>edit</Modale.Btn>
      <Modale.Content asChild>
        <div className=" rounded bg-theme p-4">
          <h2 className=" pb-2">edit product</h2>
          <form
            className=" flex flex-col gap-2"
            encType="multipart/form-data"
            method="POST"
            onSubmit={handleSubmit((values) => mutate(values))}
          >
            <Input label="name" {...register("name")} />
            <input value={storeId} {...register("storeId")} type="hidden" />
            <Btn type="submit">Submit</Btn>
          </form>
        </div>
      </Modale.Content>
    </Modale>
  );
};
type ProductDelete = RouterInputs["product"]["delete"];
interface ProductDeleteComponent extends ProductDelete {
  label: string;
}
// edit.image = ({
//   imageId,
//   imageName,
//   imagePath,
// }: {
//   imageId: string;
//   imageName: string;
//   imagePath: string;
// }) => {
//   return (
//     <UploadCoverImage
//       accept="image/*"
//       type="file"
//       imageName={imageName}
//       imagePath={imagePath}
//     />
//   );
// };
export const remove = ({
  productId,
  themeId,
  label,
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
      className=" variant-alert"
      content="Are you sure you want to delete this product ,this action cannot be undone"
      onConfirm={() => mutate({ productId, themeId })}
    >
      delete
    </ConfirmModale>
  );
};
