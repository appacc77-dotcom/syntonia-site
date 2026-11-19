import { isCurrent, useHref, useRoute } from '../../interactive/links.jsx'
// banner-founder as React + Tailwind CSS v4. Theme: variable.export {format: "tailwind"}.
export function Section02() {
  const href = useHref()
  const route = useRoute()
  return (
    <div className="relative w-full min-h-[525px] flex flex-col gap-space-l px-6 justify-center items-center [background:url(/assets/img-d8dfd795ce.jpg)_-0.48px_-65.89px_/_1440px_810px] [overflow:hidden]" data-node="966">
      <div className="self-stretch mx-auto min-h-[195px] w-full max-w-[1280px] flex flex-col items-start relative" data-node="967">
        <div className="w-[642px] min-h-[195px] flex flex-col gap-space-m justify-center items-end relative" data-node="968">
          <h2 className="w-full max-w-[642px] text-text-on-image font-['Literata'] text-[48px] font-light leading-[60px]" data-node="969">Перемены в жизни начинаются изнутри</h2>
          <a className="text-text-on-image font-['Hurricane'] text-[42px] font-normal leading-[59px] [white-space:nowrap] tracking-[0.05em]" data-node="970" data-m3-link href={href('/masters.html')} aria-current={isCurrent(route, '/masters.html') ? 'page' : undefined}>by Ekaterina Lebedeva</a>
        </div>
      </div>
    </div>
  );
}
