import { api } from "~/trpc/server";
import { NextLink, NoContent } from "~/ui";
import * as Store from "./_components/Store";

const Page = async () => {
  const stores = await api.store.getSellerStores.query();

  return (
    <>
      <div className=" bg-primary p-4  text-center text-revert-theme">
        <h2>my stores</h2>
      </div>

      <section className=" flex  flex-col   gap-4 p-4">
        {stores &&
          stores.length > 0 &&
          stores.map((store) => {
            return (
              <div
                key={store.id}
                className="  flex w-full max-w-screen-sm flex-col items-center justify-center rounded bg-theme/80  p-2  capitalize "
              >
                <h3 className="my-2"> {store.name}</h3>
                <div className=" grid w-full  grid-flow-row grid-cols-2 gap-1 py-2  ">
                  <StoreGridItem
                    name={"products"}
                    value={store.products.count}
                  />
                  <StoreGridItem name={"orders"} value={store.orders.count} />
                  <StoreGridItem
                    name={"categories"}
                    value={store.categories.count}
                  />
                </div>
                <div className=" flex w-full ">
                  <NextLink
                    href={"/dashboard/stores/" + store.id}
                    variant="fill"
                    className="  flex-1  bg-theme  hover:!shadow-overlay hover:!shadow-revert-theme/20  "
                  >
                    go to
                  </NextLink>
                  <Store.edit
                    className=" flex-1 capitalize variant-success"
                    name={store.name}
                    storeId={store.id}
                  />

                  <Store.remove
                    className=" flex-1 capitalize variant-alert "
                    name={store.name}
                    storeId={store.id}
                  />
                </div>
              </div>
            );
          })}
        {(!stores || stores.length === 0) && <NoContent />}
      </section>
      <section className=" flex justify-center  p-4">
        <Store.create />
      </section>
    </>
  );
};
const StoreGridItem = ({
  name,
  value,
}: {
  name: string;
  value: string | number;
}) => {
  return (
    <div className="flex justify-between bg-primary/30 p-1">
      <p>{name} : </p>
      <p>{value}</p>
    </div>
  );
};
export default Page;
