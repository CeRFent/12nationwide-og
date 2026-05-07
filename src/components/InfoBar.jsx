const infoItems = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
    text: "Same-Day & Scheduled Delivery"
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>,
    text: "Serving Orlando and surrounding areas"
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
    text: "Courier · Last Mile · Expedited"
  }
];

export default function InfoBar() {
  return (
    <div className="bg-brand-card border-y border-brand-card-border px-6 md:px-[60px] py-[22px] flex flex-wrap items-center justify-center gap-x-[60px] gap-y-4">
      {infoItems.map((item, i) => (
        <div key={i} className="flex items-center gap-[10px] font-display font-bold text-[13px] tracking-[1.8px] uppercase text-brand-white">
          <div className="w-[17px] h-[17px] fill-brand-accent">
            {item.icon}
          </div>
          {item.text}
        </div>
      ))}
    </div>
  );
}
