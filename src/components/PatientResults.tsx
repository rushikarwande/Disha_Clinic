import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MoveHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "@/context/SiteContentContext";

const panelTransition = {
  duration: 0.28,
  ease: "easeOut",
} as const;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const PatientResults = () => {
  const { siteData } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [comparePosition, setComparePosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const compareRef = useRef<HTMLDivElement | null>(null);

  const activeResult = siteData.patientResults[activeIndex];

  useEffect(() => {
    setComparePosition(50);
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex((current) =>
      siteData.patientResults.length === 0
        ? 0
        : Math.min(current, siteData.patientResults.length - 1),
    );
  }, [siteData.patientResults.length]);

  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  if (!activeResult) {
    return null;
  }

  const updateComparePosition = (clientX: number) => {
    const bounds = compareRef.current?.getBoundingClientRect();
    if (!bounds) {
      return;
    }

    const nextValue = ((clientX - bounds.left) / bounds.width) * 100;
    setComparePosition(clamp(nextValue, 0, 100));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
    updateComparePosition(event.clientX);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) {
      return;
    }

    updateComparePosition(event.clientX);
  };

  const goToPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? siteData.patientResults.length - 1 : current - 1,
    );
  };

  const goToNext = () => {
    setActiveIndex((current) =>
      current === siteData.patientResults.length - 1 ? 0 : current + 1,
    );
  };

  return (
    <section className="px-4 pb-8 md:px-8 lg:px-16">
      <div className="container-narrow rounded-[36px] border border-primary/12 bg-[linear-gradient(180deg,#fbf8ef_0%,#f3efe2_100%)] p-6 shadow-[0_26px_80px_-48px_rgba(41,78,64,0.45)] md:p-10">
        <div className="mb-10 max-w-3xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary/70">
            Results
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-5xl">
            {siteData.patientResultsTitle}
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {siteData.patientResultsIntro}
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-stretch">
          <div className="overflow-hidden rounded-[32px] border border-primary/12 bg-card p-4 shadow-[0_24px_60px_-40px_rgba(28,61,48,0.45)] md:min-h-[620px] md:p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeResult.id}-compare`}
                initial={{ opacity: 0.22, scale: 0.988 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.12, scale: 0.988 }}
                transition={panelTransition}
                className="flex h-full flex-col"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                      Before / After
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-foreground">
                      {activeResult.treatmentTitle}
                    </h3>
                  </div>
                  <div className="inline-flex self-start rounded-full bg-primary/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                    Drag to compare
                  </div>
                </div>

                <div
                  ref={compareRef}
                  className={`relative aspect-[4/5] flex-1 overflow-hidden rounded-[28px] border border-border bg-secondary/40 select-none md:aspect-[16/10] ${
                    isDragging ? "cursor-ew-resize" : "cursor-col-resize"
                  }`}
                  style={{ touchAction: "none" }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                >
                  <img
                    src={activeResult.afterImage}
                    alt={`${activeResult.patientName} after result`}
                    className="absolute inset-0 h-full w-full object-contain"
                    draggable={false}
                  />

                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${comparePosition}%` }}
                  >
                    <img
                      src={activeResult.beforeImage}
                      alt={`${activeResult.patientName} before result`}
                      className="absolute inset-0 h-full w-full max-w-none object-contain"
                      style={{ width: `${10000 / Math.max(comparePosition, 1)}%` }}
                      draggable={false}
                    />
                  </div>

                  <div
                    className="pointer-events-none absolute inset-y-0 z-10"
                    style={{ left: `${comparePosition}%`, transform: "translateX(-50%)" }}
                  >
                    <div className="h-full w-[2px] bg-white shadow-[0_0_0_1px_rgba(22,32,24,0.08)]" />
                    <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white text-foreground shadow-[0_18px_36px_-18px_rgba(14,30,24,0.45)]">
                      <MoveHorizontal className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full bg-foreground/78 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-primary-foreground shadow-[0_12px_24px_-16px_rgba(12,20,18,0.55)] backdrop-blur-sm">
                    Before
                  </div>
                  <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full bg-white/88 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground shadow-[0_12px_24px_-16px_rgba(12,20,18,0.25)] backdrop-blur-sm">
                    After
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-[32px] border border-primary/12 bg-foreground p-6 text-primary-foreground shadow-[0_24px_60px_-40px_rgba(13,32,24,0.55)] md:min-h-[620px] md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeResult.id}-details`}
                initial={{ opacity: 0.22, scale: 0.988 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.12, scale: 0.988 }}
                transition={panelTransition}
                className="flex h-full flex-col"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary-foreground/56">
                  Patient Details
                </p>
                <h3 className="mt-3 text-3xl font-semibold">{activeResult.patientName}</h3>
                <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-primary-foreground/58">
                  Treatment Name
                </p>
                <p className="mt-2 text-lg font-medium text-primary-foreground/92">
                  {activeResult.treatmentTitle}
                </p>
                <p className="mt-6 rounded-[24px] border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-primary-foreground/86">
                  {activeResult.duration}
                </p>
                <p className="mt-6 flex-1 leading-7 text-primary-foreground/78">
                  {activeResult.summary}
                </p>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goToPrevious}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 text-primary-foreground transition-colors hover:bg-white hover:text-foreground"
                    aria-label="Previous patient result"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex gap-2">
                    {siteData.patientResults.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          index === activeIndex ? "w-8 bg-accent" : "w-2.5 bg-white/28"
                        }`}
                        aria-label={`Show patient result ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goToNext}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 text-primary-foreground transition-colors hover:bg-white hover:text-foreground"
                    aria-label="Next patient result"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PatientResults;




