import { api } from "~/trpc/server";
import CreateStoreModaleBtn from "./_components/CreateStoreModaleBtn";

const Section = async ({
  params: { section },
}: {
  params: { section: string };
}) => {
  const stores = await api.store.getSellerStores.query();
  return (
    <>
      <div className=" bg-primary p-4  text-center text-revert-theme">
        <h2>{section}</h2>
      </div>
      <section className=" flex bg-theme p-4">
        <CreateStoreModaleBtn />
      </section>
      <section className=" flex  flex-wrap  gap-4 p-4">
        {stores &&
          stores.map((store) => {
            return (
              <div className="flex h-10 flex-1 overflow-hidden rounded-sm bg-card ">
                <span className=" h-full w-2 bg-red-500" />
                <span className=" flex items-center justify-center px-2 capitalize">
                  {store.name}
                </span>
              </div>
            );
          })}
      </section>
    </>
  );
};

export default Section;
