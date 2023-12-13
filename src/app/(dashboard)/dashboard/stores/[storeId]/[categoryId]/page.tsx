import { notFound } from "next/navigation";
import { FC, Key, PropsWithChildren } from "react";
import { api } from "~/trpc/server";
import { Btn, Collapsible, NextImage, NoContent, Switch, Table } from "~/ui";
import * as Color from "./_components/Color";
import * as Product from "./_components/Product";
import * as Size from "./_components/Size";
import { toFilePath } from "~/helpers/utile";
import { formatCurrency } from "../../../../../../lib/utile/formatters";

interface pageProps {
  params: {
    categoryId: string;
  };
}

const page: FC<pageProps> = async ({ params: { categoryId } }) => {
  const category = await api.category.read.query({ categoryId });
  if (!category) return notFound();
  const { name, colors, sizes, storeId } = category;
  const products = await api.product.read.query({ storeId, categoryId });
  return (
    <>
      <div className="  p-4  text-center text-revert-theme">
        <h1>{name}</h1>
      </div>

      <Section title="colors">
        <Color.create categoryId={categoryId} />
        <GridLayout>
          {colors &&
            colors.length > 0 &&
            colors.map((color) => {
              return (
                <Color.edit
                  key={color.id}
                  style={{
                    background: color.value,
                  }}
                  variant="none"
                  className="  capitalize   text-border   "
                  colorId={color.id}
                  {...color}
                >
                  {color.name}
                </Color.edit>
              );
            })}
        </GridLayout>
        {(colors.length == 0 || colors.length == null) && <NoContent />}
        <p>click on the color to edit</p>
        <Collapsible text="show table">
          <Table content={colors} />
        </Collapsible>
      </Section>
      <Section title="sizes">
        <Size.create categoryId={categoryId} />
        <GridLayout>
          {sizes &&
            sizes.length > 0 &&
            sizes.map((size) => {
              return (
                <Size.edit
                  key={size.id}
                  className=" capitalize  text-border  [--variant:--theme]  "
                  variant="outline"
                  sizeId={size.id}
                  {...size}
                >
                  {size.name}
                </Size.edit>
              );
            })}
        </GridLayout>
        {(sizes.length == 0 || sizes.length == null) && <NoContent />}
        <p>click on the size to edit</p>
        <Collapsible text="show table">
          <Table content={colors} />
        </Collapsible>
      </Section>
      <Section title="products">
        <Product.create
          colors={colors}
          sizes={sizes}
          storeId={storeId}
          categoryId={categoryId}
        />

        <section className=" flex w-full flex-wrap items-start justify-center gap-4 p-2">
          {products &&
            products.map((group, index) => {
              return (
                <div
                  key={group.id}
                  className="flex w-full max-w-xs flex-col  rounded-[20px] border-2 border-revert-theme"
                >
                  <div className=" flex w-full flex-col gap-1  ">
                    {group.products.map((product) => {
                      return (
                        <div
                          key={product.id}
                          className="flex flex-col overflow-hidden rounded-[20px]   bg-theme"
                        >
                          <div className=" ">
                            <h4 className=" p-2 text-center">{product.name}</h4>
                            <NextImage
                              wrapperClassName="  w-full aspect-video"
                              className=" "
                              src={toFilePath(
                                `/stores/${storeId}/${product.image?.imageName}`,
                              )}
                              alt={`${product.name} image`}
                              sizes="120px 80px"
                            />
                          </div>
                          <aside className=" grid flex-1  grid-cols-[repeat(2,1fr)] ">
                            <div
                              style={{
                                background: product.color.value,
                              }}
                              className=" flex items-center justify-center whitespace-nowrap  p-1 capitalize    text-border  "
                            >
                              {product.color.name}
                            </div>
                            <div className=" flex items-center justify-center whitespace-nowrap  p-1 capitalize  text-border  ">
                              {product.size.name}
                            </div>
                            <div className=" flex items-center justify-center whitespace-nowrap p-1 ">
                              {product.isFeatured ? "featured" : "not featured"}
                            </div>
                            <div className=" flex items-center justify-center whitespace-nowrap p-1 ">
                              {product.isApproved ? "approved" : "not approved"}
                            </div>
                            <div className=" flex items-center justify-center whitespace-nowrap p-1 ">
                              {formatCurrency(+product.price)}
                            </div>
                            <div className="  col-span-2 row-span-1 flex w-full">
                              <Product.edit
                                className=" flex-1 variant-info"
                                colors={colors}
                                sizes={sizes}
                                product={{
                                  productId: product.id,
                                  color: product.color,
                                  size: product.size,
                                  colorId: product.color.id,
                                  name: product.name,
                                  price: product.price,
                                  sizeId: product.size.id,
                                  isFeatured: product.isFeatured,
                                  image: product.image,
                                  storeId,
                                }}
                              />
                              <Product.remove
                                className=" flex-1 variant-alert"
                                productId={product.id}
                                label={product.name}
                              />
                            </div>
                          </aside>
                        </div>
                      );
                    })}
                  </div>
                  <Product.create
                    colors={colors}
                    sizes={sizes}
                    storeId={storeId}
                    categoryId={categoryId}
                    groupId={group.id}
                    className=" rounded-b-[20px]"
                    variant="ghost"
                  />
                </div>
              );
            })}
        </section>

        {(!products || products.length == 0) && <NoContent />}
        <Collapsible text="show table">
          <Table content={products || []} />
        </Collapsible>
      </Section>
    </>
  );
};
const GridLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className=" grid  w-full grid-cols-2  gap-4 p-2 md:grid-cols-3 ">
      {children}
    </div>
  );
};
const Section = ({
  children,
  title,
}: PropsWithChildren & { title: string }) => {
  return (
    <section className=" flex flex-col items-center justify-center gap-4 p-2 ">
      <h2 className=" w-full border-y-2 p-2 text-center">{title}</h2>
      {children}
    </section>
  );
};
export default page;
