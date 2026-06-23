import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LegalPage({ type = 'privacy' }) {
  const isPrivacy = type === 'privacy';

  return (
    <div className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-black">Samui Connect</Link>
          <LanguageSwitcher compact />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-card p-6 shadow-[0_20px_70px_rgba(0,0,0,.28)] md:p-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-heading text-4xl font-black">{isPrivacy ? 'Privacy Policy' : 'Terms & Community Rules'}</h1>
          <p className="mt-4 text-muted-foreground">
            This is a placeholder legal page for the early Samui Connect prototype. Before public launch with real users, rentals or providers, replace this with reviewed legal text.
          </p>

          <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground">
            <section>
              <h2 className="mb-2 text-lg font-black text-foreground">{isPrivacy ? 'Data privacy' : 'Platform role'}</h2>
              <p>
                Samui Connect is designed as a contact and discovery platform. Users and providers should not upload sensitive documents inside the app during the early phase.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-black text-foreground">{isPrivacy ? 'Contact requests' : 'Rentals and listings'}</h2>
              <p>
                Rental and stay requests currently open WhatsApp with prepared messages. Samui Connect does not process payments or guarantee external offers in this prototype.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-black text-foreground">Safety</h2>
              <p>
                Meetups, rentals and provider interactions should be verified carefully. Report, verification and moderation systems are planned for the next platform phase.
              </p>
            </section>
          </div>

          <Button asChild className="mt-8 rounded-2xl font-black">
            <Link to="/">Back to landingpage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
