import AdminHeader from "@/components/Admin/AdminHeader";
import { getCollections } from "@/lib/actions/collection/getCollections";
import { getLookbookImages } from "@/lib/actions/lookbook/getLookbookImages";

const AdminPage = async () => {
  const [collections, lookbook] = await Promise.all([
    getCollections(),
    getLookbookImages(),
  ]);

  return (
    <>
      <AdminHeader title="Genel Bakış" subTitle="Kontrol paneli" />
      <div className="max-w-270 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Tasarım", collections.result.length],
            ["Lookbook", lookbook.result.length],
          ].map(([label, count]) => (
            <div key={label} className="rounded-[8px] border border-[#f2ede424] p-5">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#f2ede473]">{label}</div>
              <div className="mt-3 font-heading text-[40px] leading-none">{count}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
