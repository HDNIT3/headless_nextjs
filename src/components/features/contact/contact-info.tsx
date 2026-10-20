import { ContactHeader } from './contact-header';
import { ContactDetailsList } from './contact-details-list';
import { ContactMockup } from './contact-mockup';
import { ContactFeatures } from './contact-features';

export function ContactInfo() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <ContactHeader />
        <ContactDetailsList />
      </div>

      <ContactMockup />
      <ContactFeatures />
    </div>
  );
}
