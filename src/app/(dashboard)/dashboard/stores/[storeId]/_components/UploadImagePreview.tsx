"use client";
import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useRef,
  useState,
} from "react";
import { toast } from "~/lib/myToast";
import { Btn, ConfirmModale, Icons } from "~/ui";

interface UploadCoverImageType extends ComponentProps<"input"> {
  maxSize?: number;
  caption?: string;
  title?: string;
  imageName?: string;
  imagePath?: string;
}
const UploadCoverImage = forwardRef<HTMLInputElement, UploadCoverImageType>(
  (
    {
      maxSize = 1024 * 1024,
      caption = "16:9 ratio is recommended. Max image size is 1mb",
      title = "Upload an image",
      onChange,
      imageName = "",
      imagePath = "",
      ...props
    },
    ref,
  ) => {
    const [imagePreview, setImagePreview] = useState(imagePath + imageName);
    const inputImageRef = useRef<HTMLInputElement>(null);
    //@ts-expect-error // ?  reffering the two refs to each other
    inputImageRef.current = ref;

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const inputImage = inputImageRef.current;
        if (!inputImage) return;
        if (file.size >= maxSize) {
          inputImage.value = "";
          toast({ message: "over size file", type: "error" });
          return;
        }
        const reader = new FileReader();

        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className=" relative isolate aspect-video">
        <input
          ref={ref}
          onChange={(e) => {
            handleImageChange(e);
            if (onChange) {
              onChange(e);
            }
          }}
          {...props}
          className=" file:absolute file:inset-0   "
        />
        <div className=" pointer-events-none absolute  inset-0 flex flex-col items-center justify-center border-2  border-dashed bg-gray-400  ">
          <Icons name="upload" className=" h-[33px] w-[33px]" />
          <p>{title}</p>
          {caption && <p className=" text-center text-gray-800">{caption}</p>}
        </div>
        {imagePreview && (
          <>
            <img
              src={imagePreview}
              className="pointer-events-none  absolute left-0 top-0 h-full  w-full  object-cover"
              alt=""
            />
            <ConfirmModale
              title="are you sure ?"
              content="this action cannot be undone"
              onConfirm={() => {
                const inputFile = inputImageRef.current;
                if (inputFile) {
                  inputFile.value = "";
                  inputFile.files = null;
                  setImagePreview("");
                }
              }}
              variant="ghost"
              className=" absolute  inset-0 flex items-center bg-gray-700/60"
            >
              <Icons className=" h-6 w-6" name="trash" />
              delete & re-upload
            </ConfirmModale>
          </>
        )}
      </div>
    );
  },
);

export default UploadCoverImage;
