import { notFound } from "next/navigation";
import { FC, PropsWithChildren } from "react";
import { api } from "~/trpc/server";
import { Btn, Collapsible, NextImage, NoContent, Table } from "~/ui";
import * as Color from "./_components/Color";
import * as Product from "./_components/Product";
import * as Size from "./_components/Size";
import { toFilePath } from "~/helpers/utile";

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
                  className="  capitalize  text-border  "
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
        <div className=" flex w-full flex-wrap">
          {products &&
            products.length > 0 &&
            products.map((product) => {
              return (
                <pre>
                  <code>{JSON.stringify(product.themes, null, 2)}</code>
                </pre>
                // <div className=" max-w-[320px] flex-1 rounded bg-theme p-2 ">
                //   <h2>{product.name}</h2>
                //   <div className=" flex flex-col ">
                //     {product.themes &&
                //       product.themes.map((img) => {
                //         return (
                //           <div key={img.id} className=" flex ">
                //             <NextImage
                //               sizes="320px 180px"
                //               wrapperClassName="w-full max-w-[320px] aspect-video  "
                //               className=" "
                //               src={toFilePath(
                //                 `/stores/${storeId}/${img.imageName}`,
                //               )}
                //               alt="product image"
                //             />
                //             <Btn
                //               key={img.color.id}
                //               style={{
                //                 background: img.color.value,
                //               }}
                //               className="  capitalize  text-border  "
                //             >
                //               {img.color.name}
                //             </Btn>
                //             <Btn className="capitalize  text-border">
                //               {img.size.name}
                //             </Btn>
                //             {/* <Product.edit {...product} /> */}
                //           </div>
                //         );
                //       })}
                //   </div>
                // </div>
              );
            })}
        </div>
        {(products.length == 0 || products.length == null) && <NoContent />}
        <p>click on the product to edit</p>
        <Collapsible text="show table">
          <Table content={products} />
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
