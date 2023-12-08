import { notFound, redirect } from "next/navigation";
import { FC, Fragment } from "react";
import { toFilePath } from "~/helpers/utile";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { NextImage, NextLink, NoContent } from "~/ui";
import * as Billboard from "./_components/Billboard";
import * as Category from "./_components/Category";

interface StoreProps {
  params: { storeId: string };
}

const Store: FC<StoreProps> = async ({ params: { storeId } }) => {
  const storeData = await api.store.read.query({ storeId });
  if (!storeData) return notFound();

  return (
    <>
      <div className=" bg-primary p-4  text-center text-revert-theme">
        <h1>{storeData?.name}</h1>
      </div>
      <section className=" flex flex-col justify-center gap-4 px-2 ">
        <h2 className="p-2 text-center">categorys</h2>
        {storeData?.categories.length != 0 ? (
          <>
            {storeData?.categories.map((category) => {
              return (
                <Fragment key={category.id}>
                  <h3 className=" w-full border-y-2 p-2 text-center">
                    {category.name}
                  </h3>
                  <div className="  flex  w-full  flex-wrap  justify-center  ">
                    <NextLink
                      className="   capitalize "
                      variant="fill"
                      href={`/dashboard/stores/${storeId}/${category.id}`}
                    >
                      products
                    </NextLink>

                    <Category.edit
                      className="capitalize"
                      categoryId={category.id}
                      name={category.name}
                    />
                    {category.billboard.length < 3 && (
                      <Billboard.create
                        storeId={storeId}
                        categoryId={category.id}
                        className=" capitalize"
                      />
                    )}
                    <Category.remove
                      category={{
                        id: category.id,
                        name: category.name,
                      }}
                    />
                  </div>
                  <div className=" flex flex-col gap-4 py-2 xl:flex-row  ">
                    {category.billboard &&
                      category.billboard.map((billboard) => {
                        return (
                          <div
                            key={billboard.id}
                            className="  mx-auto w-full   max-w-screen-xs  rounded   bg-theme "
                          >
                            <div className=" relative flex aspect-video w-full items-center justify-center">
                              <NextImage
                                sizes="320px 180px"
                                wrapperClassName=" absolute inset-0 "
                                src={toFilePath(
                                  `/stores/${storeId}/${billboard.imageName}`,
                                )}
                                alt=""
                              />
                              <h3 className="  relative text-border   ">
                                {billboard.label}
                              </h3>
                            </div>

                            <div className=" flex justify-center   p-2 ">
                              <Billboard.edit
                                className="flex-1  capitalize"
                                billboardId={billboard.id}
                                storeId={storeId}
                                imageName={billboard.imageName}
                                imagePath={toFilePath(`/stores/${storeId}/`)}
                                label={billboard.label}
                                name={category.name}
                              />
                              <Billboard.remove
                                billboardId={billboard.id}
                                label={billboard.label}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Fragment>
              );
            })}
          </>
        ) : (
          <NoContent />
        )}
        <div className=" flex justify-center">
          <Category.create storeId={storeId}>add category</Category.create>
        </div>
      </section>
    </>
  );
};

export default Store;
