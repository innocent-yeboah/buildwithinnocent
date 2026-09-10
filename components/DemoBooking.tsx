"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/Icons";

type Service = { id: string; name: string; duration: string; price: number };

const services: Service[] = [
  { id: "swedish", name: "Swedish Massage", duration: "60 min", price: 180 },
  { id: "deep-tissue", name: "Deep Tissue Massage", duration: "75 min", price: 250 },
  { id: "facial", name: "Signature Facial", duration: "45 min", price: 150 },
  { id: "couples", name: "Couples Package", duration: "90 min", price: 420 },
];

const timeSlots = ["9:00 AM", "10:30 AM", "12:00 PM", "2:00 PM", "3:30 PM", "5:00 PM"];

type Step = "service" | "time" | "pay" | "done";

/** Next 5 days, formatted for the date picker. */
function upcomingDays(): { key: string; weekday: string; date: string }[] {
  const formatterWeekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" });
  const formatterDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      key: d.toISOString().slice(0, 10),
      weekday: formatterWeekday.format(d),
      date: formatterDate.format(d),
    };
  });
}

/**
 * Simulated customer booking flow for the demo spa. Everything runs
 * locally — the payment step is clearly marked as a simulation.
 */
export default function DemoBooking() {
  const [step, setStep] = useState<Step>("service");
  const [service, setService] = useState<Service | null>(null);
  const [day, setDay] = useState<string>("");
  const [slot, setSlot] = useState<string>("");
  const [paying, setPaying] = useState(false);
  const days = useMemo(upcomingDays, []);

  const stepIndex = { service: 0, time: 1, pay: 2, done: 3 }[step];

  function simulatePayment() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setStep("done");
    }, 1600);
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Demo frame */}
      <div className="overflow-hidden rounded-3xl border border-primary-100 shadow-card-hover">
        {/* Fake browser chrome */}
        <div className="flex items-center gap-2 bg-primary-900 px-5 py-3">
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-[#FF6B6B]" />
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-gold" />
          <span aria-hidden="true" className="h-3 w-3 rounded-full bg-growth" />
          <p className="ml-3 truncate rounded-md bg-white/10 px-3 py-1 text-xs text-primary-100">
            serenitydemo.buildwithinnocent.com/book
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8">
          {/* Progress steps */}
          <ol className="flex items-center gap-2" aria-label="Booking steps">
            {["Service", "Date & Time", "Payment", "Confirmed"].map((label, i) => (
              <li key={label} className="flex flex-1 flex-col items-center gap-1.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    i < stepIndex
                      ? "bg-growth text-white"
                      : i === stepIndex
                        ? "bg-primary text-gold"
                        : "bg-primary-50 text-primary-300"
                  }`}
                >
                  {i < stepIndex ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="hidden text-[10px] font-semibold text-ink/60 sm:block">
                  {label}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-8 min-h-[22rem]">
            {step === "service" && (
              <div className="animate-fade-in">
                <h2 className="font-display text-xl font-bold text-primary">
                  Choose your treatment
                </h2>
                <div className="mt-5 space-y-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setService(s);
                        setStep("time");
                      }}
                      className="flex w-full items-center justify-between rounded-xl border-2 border-primary-100 px-5 py-4 text-left transition-all hover:border-growth hover:bg-growth-50"
                    >
                      <span>
                        <span className="block font-semibold text-primary">{s.name}</span>
                        <span className="block text-xs text-ink/60">{s.duration}</span>
                      </span>
                      <span className="font-display text-lg font-bold text-growth">
                        GHS {s.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "time" && service && (
              <div className="animate-fade-in">
                <h2 className="font-display text-xl font-bold text-primary">
                  Pick a date and time
                </h2>
                <p className="mt-1 text-sm text-ink/60">
                  {service.name} &middot; {service.duration}
                </p>
                <div className="mt-5 grid grid-cols-5 gap-2">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDay(d.key)}
                      className={`rounded-xl border-2 px-2 py-3 text-center transition-colors ${
                        day === d.key
                          ? "border-growth bg-growth-50"
                          : "border-primary-100 hover:border-primary"
                      }`}
                    >
                      <span className="block text-xs font-semibold text-ink/60">{d.weekday}</span>
                      <span className="block text-sm font-bold text-primary">{d.date}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSlot(t)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                        slot === t
                          ? "border-growth bg-growth-50 text-growth-700"
                          : "border-primary-100 text-primary hover:border-primary"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep("service")}
                    className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    disabled={!day || !slot}
                    onClick={() => setStep("pay")}
                    className="btn-primary !px-6 !py-2.5 !text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue to Payment <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {step === "pay" && service && (
              <div className="animate-fade-in">
                <h2 className="font-display text-xl font-bold text-primary">
                  Pay your deposit
                </h2>
                <div className="mt-4 rounded-xl bg-primary-50 p-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink/70">{service.name}</span>
                    <span className="font-semibold text-primary">GHS {service.price}</span>
                  </div>
                  <div className="mt-1.5 flex justify-between">
                    <span className="text-ink/70">
                      {days.find((d) => d.key === day)?.weekday},{" "}
                      {days.find((d) => d.key === day)?.date} at {slot}
                    </span>
                    <span className="font-semibold text-growth">
                      Deposit: GHS {Math.round(service.price / 2)}
                    </span>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <button
                    type="button"
                    onClick={simulatePayment}
                    disabled={paying}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gold px-5 py-4 font-bold text-primary-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {paying ? "Processing…" : "Pay with Mobile Money (MTN, Telecel, AT)"}
                  </button>
                  <button
                    type="button"
                    onClick={simulatePayment}
                    disabled={paying}
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-primary px-5 py-4 font-bold text-primary transition-colors hover:bg-primary hover:text-white disabled:opacity-60"
                  >
                    Pay with Card
                  </button>
                </div>
                <p className="mt-4 text-center text-xs font-semibold text-ink/50">
                  Demo only — no real payment happens here.
                </p>
                <button
                  type="button"
                  onClick={() => setStep("time")}
                  className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  &larr; Back
                </button>
              </div>
            )}

            {step === "done" && service && (
              <div className="animate-fade-up text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-growth text-white">
                  <CheckIcon className="h-8 w-8" />
                </span>
                <h2 className="mt-5 font-display text-2xl font-bold text-primary">
                  Booking Confirmed.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink/80">
                  {service.name} on{" "}
                  <strong>
                    {days.find((d) => d.key === day)?.weekday},{" "}
                    {days.find((d) => d.key === day)?.date}
                  </strong>{" "}
                  at <strong>{slot}</strong>. A confirmation SMS and email
                  just went out, a reminder is scheduled for the day before,
                  and this booking is already sitting in the owner&rsquo;s
                  dashboard.
                </p>
                <div className="mt-6 rounded-xl bg-gold-50 p-4 text-sm font-semibold text-gold-800">
                  Notice what did not happen: no DMs, no back-and-forth, no
                  &ldquo;is this slot free?&rdquo; The system handled it all.
                </div>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/demo/dashboard" className="btn-primary !px-6 !py-3 !text-sm">
                    See the Owner&rsquo;s Side <span aria-hidden="true">&rarr;</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("service");
                      setService(null);
                      setDay("");
                      setSlot("");
                    }}
                    className="btn-secondary !px-6 !py-3 !text-sm"
                  >
                    Book Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
