import AdminHeader from "@/components/Admin/AdminHeader";
import ContactForm from "@/components/Admin/ContactForm";
import { getContact } from "@/lib/actions/contact/getContact";

const ContactPage = async () => {
  const result = await getContact();

  return (
    <>
      <AdminHeader title="04 — İletişim" subTitle="İletişim Bilgileri" />

      <div className="max-w-270 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <ContactForm contact={result} />
      </div>
    </>
  );
};

export default ContactPage;
