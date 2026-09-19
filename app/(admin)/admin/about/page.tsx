import AboutForm from "@/components/Admin/AboutForm";
import AdminHeader from "@/components/Admin/AdminHeader";
import { getAbout } from "@/lib/actions/about/getAbout";

const AboutPage = async () => {
  const response = await getAbout();

  return (
    <>
      <AdminHeader title="01 — Hakkımda" subTitle="Hakkımda Bölümü" />
      <div className="max-w-270 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <AboutForm about={response.result.about} portrait={response.result.portrait} />
      </div>
    </>
  );
};

export default AboutPage;
