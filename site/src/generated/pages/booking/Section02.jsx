// booking-formats as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
import { BookingFormats } from '../../../interactive/components/BookingFormats.jsx'
export function Section02() {
  return (
    <div className="relative min-h-[1546px] w-full flex flex-row px-6 justify-center items-start bg-bg-page [overflow:hidden]" data-node="8236">
      <div className="flex-1 min-h-[1546px] w-full max-w-[1280px] flex flex-col gap-space-2xl py-space-3xl items-start relative" data-node="8237">
        <div className="self-stretch min-h-[20px] w-full max-w-[1280px] flex flex-row gap-space-s items-center relative" data-node="8238">
          <p className="text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="8239">первый шаг</p>
          <div className="flex-1 w-full max-w-[918px] h-0 [outline:2px_solid_var(--color-accent-muted,_#8A8560)] [outline-offset:-2px]" data-node="8240"></div>
          <p className="text-text-primary font-['Golos_Text'] text-[13px] font-normal leading-[20px] [white-space:nowrap] tracking-[0.16em] uppercase" data-node="8241">глубокое сопровождение</p>
        </div>
        <BookingFormats />
      </div>
    </div>
  );
}
