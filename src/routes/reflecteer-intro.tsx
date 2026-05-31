import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneShell, TopBar } from "@/components/PhoneShell";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/reflecteer-intro")({
  component: ReflecteerIntro,
});

const SLIDES = [
  {
    title: "Welkom bij de",
    titleHighlight: "Reflecteer eerst",
    subtitle: "route",
    description:
      "Te veel minoren, maar geen idee waar je moet beginnen? Keuzekompas helpt je stap voor stap bij het maken van een keuze die bij jou past.",
    color: "bg-mint",
  },
  {
    title: "Zo werkt het",
    description: null,
    listItems: [
      "Vul je reflectie profiel in",
      "Verken minoren",
      "Bekijk je favorieten in de shortlist",
      "Vergelijk je gekozen opties en vind jouw ideale minor",
    ],
    color: "bg-orange",
  },
  {
    title: "Je hoeft niets in één keer",
    description:
      "Alles wordt automatisch bewaard. Je kunt op elk moment pauzeren terugkomen en je antwoorden aanpassen.",
    color: "bg-indigo",
  },
  {
    title: "Hulp nodig onderweg?",
    description:
      "Op elke pagina bevind zich rechtsboven een vraagteken over wat je daar kunt doen. Klik hierop wanneer je iets onduidelijk vind.",
    color: "bg-sun",
  },
];

function ReflecteerIntro() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate({ to: "/quiz/interesses" });
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    navigate({ to: "/quiz/interesses" });
  };

  const slide = SLIDES[currentSlide];

  return (
    <PhoneShell bg="bg-background">
      <TopBar
        left={
          <button
            onClick={() => {
              if (currentSlide > 0) {
                handlePrev();
              } else {
                navigate({ to: "/start-mode" });
              }
            }}
            className="icon-btn shrink-0"
            aria-label="Terug"
          >
            <ArrowLeft size={20} />
          </button>
        }
        right={
          <button
            onClick={handleSkip}
            className="text-sm font-semibold px-4 py-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            Overslaan
          </button>
        }
      />

      {/* Main Content Container */}
      <div className="flex flex-col flex-1 h-full">
        {/* Middle Section - Content */}
        <div className="flex-1 px-5 py-8 overflow-y-auto">
          {/* Icon Circle */}
          <div
            className={`w-24 h-24 rounded-full ${slide.color} flex items-center justify-center mb-8 shrink-0 transition-colors duration-300`}
          >
            {/* Icon placeholder - will be replaced with actual icons later */}
            <div className="w-12 h-12" />
          </div>

          <h1 className="text-3xl font-extrabold leading-tight">
            {slide.title}
            {slide.titleHighlight && (
              <>
                <br />
                <span className="text-mint">{slide.titleHighlight}</span>
              </>
            )}
            {slide.subtitle && (
              <>
                <br />
                {slide.subtitle}
              </>
            )}
          </h1>

          {slide.description && (
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              {slide.description}
            </p>
          )}

          {slide.listItems && (
            <ol className="mt-6 space-y-4">
              {slide.listItems.map((item, index) => (
                <li key={index} className="flex gap-4">
                  <span className="font-bold text-muted-foreground shrink-0">
                    {index + 1}.
                  </span>
                  <span className="text-base text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Bottom Section - Navigation */}
        <div className="px-5 py-6 space-y-4 bg-gradient-to-t from-background">
          {/* Dots */}
          <div className="flex justify-center gap-2">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-orange w-6" : "bg-muted w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button onClick={handleNext} className="btn-pill btn-primary w-full">
            {currentSlide === SLIDES.length - 1
              ? "Begin met reflecteren"
              : "Volgende"}
          </button>
        </div>
      </div>
    </PhoneShell>
  );
}
