import AdminHeader from "@/components/Admin/AdminHeader";
import LookbookManager from "@/components/Admin/LookbookManager";
import { getLookbookImages } from "@/lib/actions/lookbook/getLookbookImages";

const LookbookPage = async () => {
  const response = await getLookbookImages();

  return (
    <>
      <AdminHeader title="03 — Lookbook" subTitle="Lookbook Görselleri" />

      <div className="max-w-270 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        {!response.success && (
          <p className="mb-4 text-sm text-red-400">{response.message}</p>
        )}
        <LookbookManager images={response.result} />
      </div>
    </>
  );
};

export default LookbookPage;
