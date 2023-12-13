"use client";
import {
  ChangeEvent,
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ConfirmModale, Icons } from "~/ui";
import { cn } from "../lib/cva";

interface UploadCoverImageType extends ComponentProps<"input"> {
  maxSize?: number;
  caption?: string;
  title?: string;
  previewSrc?: string;
  errorMSG?: string;
}
const UploadCoverImage = forwardRef<HTMLInputElement, UploadCoverImageType>(
  (
    {
      maxSize = 1024 * 1024,
      caption = "16:9 ratio is recommended. Max image size is 1mb",
      title = "Upload an image",
      onChange,
      previewSrc = "",
      className,
      errorMSG = "",
      ...props
    },
    forwardedRef,
  ) => {
    const [imagePreview, setImagePreview] = useState(previewSrc);
    const inputImageRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(forwardedRef, () => inputImageRef.current!, []); // ?  reffering the two refs to each other

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const inputImage = inputImageRef.current;
        if (!inputImage) return;
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    return (
      <div className={cn(" relative isolate aspect-video", className)}>
        <input
          ref={inputImageRef}
          onChange={(e) => {
            handleImageChange(e);
            if (onChange) {
              onChange(e);
            }
          }}
          accept="image/*"
          type="file"
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
        {errorMSG && (
          <>
            <div className=" pointer-events-none absolute inset-0 flex items-center  justify-center  bg-rose-700/60 text-center">
              {errorMSG}
            </div>
          </>
        )}
      </div>
    );
  },
);

export default UploadCoverImage;
