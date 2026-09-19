import { getContact } from "@/lib/actions/contact/getContact";

const Contact = async () => {
  const contact = await getContact();
  if (!contact.success || !contact.result) return null;

  const linkedInValue = contact.result.linkedin.trim();
  const linkedInHref = /^https?:\/\//i.test(linkedInValue)
    ? linkedInValue
    : `https://${linkedInValue}`;

  return (
    <section id="contact" className="scroll-mt-28 px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-28">
      <div className="mb-6 text-xs uppercase tracking-[0.16em] text-main">04 — İletişim</div>
      <h2 className="m-0 mb-10 text-pretty font-heading text-[clamp(44px,12vw,72px)] font-normal leading-[0.95] tracking-[-0.03em] md:text-[clamp(56px,7vw,120px)]">
        {contact.result.title}
      </h2>
      <div className="flex flex-wrap gap-x-10 gap-y-3 break-all text-[16px] sm:break-normal">
        <a href={`mailto:${contact.result.email}`} className="border-b border-b-[#f2ede466] pb-1">
          {contact.result.email}
        </a>
        {linkedInValue && (
          <a href={linkedInHref} target="_blank" rel="noreferrer" className="border-b border-b-[#f2ede466] pb-1">
            LinkedIn
          </a>
        )}
      </div>
    </section>
  );
};

export default Contact;
