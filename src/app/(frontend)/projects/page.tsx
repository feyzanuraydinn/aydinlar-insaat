"use client";

import { useState, useEffect, useMemo } from "react";
import { Project } from "@/types";
import ProjectCard from "@/components/frontend/ProjectCard";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import { PageSpinner } from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import SortDropdown from "@/components/ui/SortDropdown";
import AnimatedSection from "@/components/ui/AnimatedSection";

const ITEMS_PER_PAGE = 9;

type SortOrder = 'newest' | 'oldest';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Yeniden Eskiye' },
  { value: 'oldest', label: 'Eskiden Yeniye' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filters = [
    { id: "all", label: "Tüm Projeler" },
    { id: "RESIDENTIAL", label: "Konut Projeleri" },
    { id: "COMMERCIAL", label: "Ticari Projeler" },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, sortOrder]);

  const filteredProjects = projects.filter(project => {
    if (activeFilter === "all") return true;
    return project.type === activeFilter;
  });

  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      if (sortOrder === 'newest') {
        return yearB - yearA;
      } else {
        return yearA - yearB;
      }
    });
  }, [filteredProjects, sortOrder]);

  const totalPages = Math.ceil(sortedProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalProjects = projects.length;
  const residentialProjects = projects.filter(p => p.type === "RESIDENTIAL").length;
  const commercialProjects = projects.filter(p => p.type === "COMMERCIAL").length;

  if (loading) {
    return <PageSpinner text="Projeler yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 overflow-hidden bg-hero">
        <DotGridBackground />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center text-text-white">
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-white">
              Projeler
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg md:text-xl leading-relaxed text-primary-bg">
              Yıllardır hayata geçirdiğimiz tüm projeleri keşfedin.
              Modern mimari, kaliteli işçilik ve sürdürülebilir çözümlerle inşa ettiğimiz eserler.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-text-white">
                  {totalProjects}+
                </div>
                <div className="text-xs sm:text-sm font-medium text-primary-bg-hover">
                  Toplam Proje
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-text-white">
                  {residentialProjects}+
                </div>
                <div className="text-xs sm:text-sm font-medium text-primary-bg-hover">
                  Konut
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-text-white">
                  {commercialProjects}+
                </div>
                <div className="text-xs sm:text-sm font-medium text-primary-bg-hover">
                  Ticari
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-8 md:py-10 border-b border-border bg-surface">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center gap-4 sm:hidden">
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200 ${
                    activeFilter === filter.id
                      ? "bg-primary text-text-white shadow-lg shadow-blue-600/25"
                      : "bg-surface-hover text-text-secondary hover:bg-border"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <SortDropdown
              options={SORT_OPTIONS}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOrder)}
            />
          </div>
          <div className="hidden sm:flex xl:hidden items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200 ${
                    activeFilter === filter.id
                      ? "bg-primary text-text-white shadow-lg shadow-blue-600/25"
                      : "bg-surface-hover text-text-secondary hover:bg-border"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <SortDropdown
              options={SORT_OPTIONS}
              value={sortOrder}
              onChange={(value) => setSortOrder(value as SortOrder)}
            />
          </div>
          <div className="hidden xl:flex items-center justify-center relative">
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 text-sm cursor-pointer font-medium rounded-full transition-all duration-200 ${
                    activeFilter === filter.id
                      ? "bg-primary text-text-white shadow-lg shadow-blue-600/25"
                      : "bg-surface-hover text-text-secondary hover:bg-border"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            <div className="absolute right-0">
              <SortDropdown
                options={SORT_OPTIONS}
                value={sortOrder}
                onChange={(value) => setSortOrder(value as SortOrder)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container px-4 mx-auto">
          {paginatedProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 place-items-center lg:grid-cols-3">
                {paginatedProjects.map((project, index) => {
                  const getAnimation = () => {
                    const positionInRow = index % 3;
                    if (positionInRow === 0) return "fade-right";
                    if (positionInRow === 1) return "fade-up";
                    return "fade-left";
                  };
                  return (
                    <AnimatedSection key={project.id} animation={getAnimation()} duration={600} delay={(index % 3) * 100} className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px]">
                      <ProjectCard project={project} />
                    </AnimatedSection>
                  );
                })}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                variant="simple"
              />
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-24 h-24 mx-auto mb-6 text-border-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mb-4 text-xl font-semibold text-text-heading">
                  Proje Bulunamadı
                </h3>
                <p className="mb-6 text-text-secondary">
                  {activeFilter === "all"
                    ? "Henüz proje eklenmemiş."
                    : "Seçili filtreye uygun proje bulunamadı. Lütfen farklı bir filtre seçin."}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
