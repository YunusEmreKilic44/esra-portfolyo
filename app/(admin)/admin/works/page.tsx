import AdminHeader from "@/components/Admin/AdminHeader";
import WorksManager from "@/components/Admin/WorksManager";
import { getCollections } from "@/lib/actions/collection/getCollections";

const WorksPage = async () => {
  const response = await getCollections();

  return (
    <>
      <AdminHeader
        title="02 — Seçilmiş İşler"
        subTitle="Ürünler & Koleksiyonlar"
      />

      <div className="max-w-270 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {!response.success && (
          <p className="mb-4 text-sm text-red-400">{response.message}</p>
        )}
        <WorksManager collections={response.result} />
      </div>
    </>
  );
};

export default WorksPage;
