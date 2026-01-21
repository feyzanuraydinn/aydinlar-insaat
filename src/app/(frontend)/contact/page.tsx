"use client";

import { useState, useEffect } from "react";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import { PageSpinner } from "@/components/ui/Spinner";

interface TeamMember {
  id: string;
  name: string;
  profession: string;
  phone: string;
  email: string;
  websiteUrl: string;
  image: string;
  order: number;
}

interface Settings {
  contactPage: {
    contactTitle: string;
    contactTeamDescription: string;
    latitude: number | null;
    longitude: number | null;
  };
}

export default function ContactPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, settingsRes] = await Promise.all([
          fetch("/api/team-members"),
          fetch("/api/settings")
        ]);

        if (teamRes.ok) {
          const teamData = await teamRes.json();
          setTeamMembers(teamData.teamMembers || []);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading durumunda spinner göster
  if (loading) {
    return <PageSpinner />;
  }

  // Veriler yüklendikten sonraki değerler
  const contactTitle = settings?.contactPage?.contactTitle || "İletişim";
  const contactTeamDescription = settings?.contactPage?.contactTeamDescription || "Size en yakın temsilcimizle iletişime geçin";
  const latitude = settings?.contactPage?.latitude || 40.72826;
  const longitude = settings?.contactPage?.longitude || 29.98846;

  // Google Maps URL oluştur - marker ile
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section with Map */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] md:min-h-[60vh] overflow-hidden bg-hero pt-20 pb-8 sm:pt-24 sm:pb-12">
        {/* DotGrid Background */}
        <DotGridBackground/>

        {/* Google Maps */}
        <div className="container relative z-10 h-full px-4 mx-auto">
          <div className="flex flex-col items-center justify-center h-full text-center text-text-white">
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-white">{contactTitle}</h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl leading-relaxed text-primary-bg">
              {contactTeamDescription}
            </p>

            {/* Google Maps Embed */}
            <div className="w-full h-48 sm:h-56 md:h-64 max-w-4xl overflow-hidden shadow-2xl rounded-xl">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container px-4 mx-auto">
          <div className="mb-8 sm:mb-12 md:mb-16 text-center">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-heading">
              Ekibimiz
            </h2>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-secondary">
              {contactTeamDescription || "30 yıllık tecrübemizle projelerinizi hayata geçiren uzman ekibimizle tanışın"}
            </p>
          </div>

          {teamMembers.length > 0 ? (
            <div className="grid max-w-6xl grid-cols-1 gap-6 sm:gap-8 mx-auto sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-full max-w-[260px] sm:max-w-[280px] rounded-xl shadow-lg overflow-hidden bg-surface flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 mx-auto"
                >
                  {/* Profile Image */}
                  <div className="w-full aspect-[5/4] bg-surface-hover overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="object-cover object-center w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex flex-col gap-2">
                    {/* Name & Profession */}
                    <div className="text-center border-b border-gray-100 pb-2">
                      <h3 className="text-sm sm:text-base font-bold text-text-heading">{member.name}</h3>
                      {member.profession && (
                        <p className="mt-0.5 text-xs text-text-tertiary">{member.profession}</p>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col gap-1.5">
                      {/* Phone */}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-surface hover:bg-primary-bg transition-colors group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 bg-primary-bg-hover rounded-full group-hover:bg-primary-bg transition-colors">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3.5 h-3.5 fill-primary"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </div>
                          <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">{member.phone}</span>
                        </a>
                      )}

                      {/* Email */}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-surface hover:bg-primary-bg transition-colors group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 bg-primary-bg-hover rounded-full group-hover:bg-primary-bg transition-colors">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3.5 h-3.5 fill-primary"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" fill="none" stroke="white" strokeWidth="2" />
                            </svg>
                          </div>
                          <span className="text-xs text-text-secondary group-hover:text-primary transition-colors truncate">{member.email}</span>
                        </a>
                      )}

                      {/* Website URL (optional) */}
                      {member.websiteUrl && (
                        <a
                          href={member.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-1.5 rounded-lg bg-surface hover:bg-primary-bg transition-colors group"
                        >
                          <div className="flex items-center justify-center w-7 h-7 bg-primary-bg-hover rounded-full group-hover:bg-primary-bg transition-colors">
                            <svg
                              viewBox="0 0 24 24"
                              className="w-3.5 h-3.5 stroke-primary"
                              fill="none"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          </div>
                          <span className="text-xs text-text-secondary group-hover:text-primary transition-colors truncate">{member.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 sm:py-12 text-center">
              <p className="text-base sm:text-lg text-text-tertiary">Ekip üyesi bulunamadı</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
