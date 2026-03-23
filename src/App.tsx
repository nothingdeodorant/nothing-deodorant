import React, { useEffect, useMemo, useState } from "react";

const floatStyle = document.createElement("style");
floatStyle.textContent = `
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  h1, h2, h3 { color: #0a0a0a; }
`;
document.head.appendChild(floatStyle);

const BEEHIIV_PUB_ID = "pub_700a1fc9-fe95-4bca-9282-511ed29f5233";
const BEEHIIV_API_KEY = "6PNqelHbE8KaycGWaACn4MPIJiptcMMjyc7ejsvxOzYdVD4VJue4sDQgQoNmjsTS";

async function submitToBeehiiv(email: string): Promise<boolean> {
  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: false }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) { setStatus("error"); return; }
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") return (
    <div style={{padding: '12px 16px', borderRadius: '14px', background: dark ? 'rgba(255,255,255,0.15)' : '#f0fdf4', color: dark ? 'white' : '#166534', fontSize: '14px', textAlign: 'center'}}>
      ✓ You're on the list! We'll be in touch.
    </div>
  );

  return (
    <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
      <input
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        style={{flex: 1, minWidth: '200px', height: '46px', borderRadius: '14px', border: dark ? `1px solid ${status === 'error' ? '#f87171' : 'rgba(255,255,255,0.25)'}` : `1px solid ${status === 'error' ? '#f87171' : '#d1d5db'}`, background: dark ? 'rgba(255,255,255,0.1)' : 'white', padding: '0 16px', fontSize: '14px', color: dark ? 'white' : '#0a0a0a', outline: 'none'}}
        placeholder={status === 'error' ? 'Please enter a valid email' : 'Enter your email'}
      />
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        style={{height: '46px', borderRadius: '14px', background: dark ? 'white' : '#0a0a0a', color: dark ? '#0a0a0a' : 'white', padding: '0 22px', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', opacity: status === 'loading' ? 0.7 : 1}}
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist →'}
      </button>
    </div>
  );
}

// Clean single-file prototype for the Nothing deodorant site.
const PAGES = ["Home", "How It Works", "Ingredients", "About", "FAQ"];

function normalizePage(value) {
  return PAGES.includes(value) ? value : "Home";
}

function runSanityChecks() {
  console.assert(normalizePage("Home") === "Home", "Home should remain Home");
  console.assert(normalizePage("Shop") === "Shop", "Shop should remain Shop");
  console.assert(normalizePage("Bad Page") === "Home", "Unknown pages should fall back to Home");
  console.assert(normalizePage("") === "Home", "Empty hash should fall back to Home");
}

runSanityChecks();

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-black text-white"
          : "text-black/65 hover:bg-black/5 hover:text-black"
      }`}
    >
      {label}
    </button>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-black px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
    >
      {children}
    </button>
  );
}

function SectionEyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs uppercase tracking-[0.35em] ${
        light ? "text-white/60" : "text-black/50"
      }`}
    >
      {children}
    </p>
  );
}

function ProductMockup({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{ animation: "float 4.5s ease-in-out infinite" }}
      className={`relative z-10 h-[420px] w-[230px] rounded-[3rem] border shadow-2xl ${
        dark
          ? "border-white/20 bg-neutral-950 text-white"
          : "border-black bg-white text-black"
      }`}
    >
      <div className="absolute inset-x-6 top-10 text-center">
        <div className="text-2xl font-semibold tracking-[0.15em]">NOTHING</div>
        <div
          className={`mt-4 text-xs uppercase tracking-[0.2em] ${
            dark ? "text-white/55" : "text-black/60"
          }`}
        >
          Odor Neutralizing
        </div>
        <div className={`mt-4 text-xs ${dark ? "text-white/70" : "text-black/70"}`}>
          Smell like nothing.
        </div>
      </div>

      <div
        className={`absolute inset-x-6 bottom-16 space-y-1 text-center text-xs uppercase tracking-[0.15em] ${
          dark ? "text-white/60" : "text-black/65"
        }`}
      >
        <div>Aluminum-Free</div>
        <div>Fragrance-Free</div>
        <div>Gender Neutral</div>
      </div>

      <div
        className={`absolute inset-x-8 bottom-6 h-8 rounded-2xl ${
          dark ? "border border-white/25" : "border border-black"
        }`}
      />
    </div>
  );
}

function SiteShell({ currentPage, setCurrentPage, children }: { currentPage: string; setCurrentPage: (page: string) => void; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-12">
          <button
            type="button"
            onClick={() => setCurrentPage("Home")}
            className="text-2xl font-semibold tracking-[0.18em]"
          >
            NOTHING
          </button>

          <nav className="hidden flex-wrap items-center gap-2 lg:flex">
            {PAGES.map((page) => (
              <NavButton
                key={page}
                label={page}
                active={currentPage === page}
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </nav>

          <div className="hidden md:block">
            <PrimaryButton onClick={() => {
              setCurrentPage("Home");
              setTimeout(() => {
                const el = document.getElementById("waitlist");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}>Join Waitlist</PrimaryButton>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-black/5 px-4 py-3 lg:hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {PAGES.map((page) => (
            <NavButton
              key={page}
              label={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            />
          ))}
        </div>
      </header>

      {children}

      <footer style={{borderTop: '1px solid #e5e5e5', background: '#fafafa'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '48px clamp(20px, 5vw, 32px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '40px', textAlign: 'left'}}>
          <div style={{textAlign: 'left'}}>
            <div style={{fontSize: '20px', fontWeight: 600, letterSpacing: '0.18em', textAlign: 'left'}}>NOTHING</div>
            <p style={{marginTop: '12px', fontSize: '13px', lineHeight: '1.7', color: '#666', maxWidth: '280px', textAlign: 'left'}}>
              A radically simple deodorant brand built for people who want odor protection without added scent.
            </p>
          </div>
          <div style={{textAlign: 'left'}}>
            <div style={{fontSize: '13px', fontWeight: 600, textAlign: 'left'}}>Explore</div>
            <div style={{marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start'}}>
              {PAGES.map((page) => (
                <button key={page} type="button" onClick={() => setCurrentPage(page)}
                  style={{textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: '#666', padding: 0, display: 'block'}}>
                  {page}
                </button>
              ))}
            </div>
          </div>
          <div style={{textAlign: 'left'}}>
            <div style={{fontSize: '13px', fontWeight: 600, textAlign: 'left'}}>Launch</div>
            <button type="button"
              onClick={() => { setCurrentPage("Home"); setTimeout(() => { const el = document.getElementById("waitlist"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); }}
              style={{marginTop: '12px', textAlign: 'left', fontSize: '13px', lineHeight: '1.7', color: '#666', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'block'}}>
              Join early access for first-run availability and launch offers.
            </button>
          </div>
        </div>
        <div style={{borderTop: '1px solid #e5e5e5', padding: '14px 32px', textAlign: 'center'}}>
          <span style={{fontSize: '11px', color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase'}}>© 2025 Nothing — Eliminate odor. Add nothing.</span>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ features, ingredients, taglines, setCurrentPage }: { features: string[]; ingredients: {name: string; role: string}[]; taglines: string[]; setCurrentPage: (page: string) => void }) {
  return (
    <>
      <section className="border-b border-black/10">
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 32px)'}}>
          <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '40px', alignItems: 'center'}} className="md:grid-cols-2">
          <div>
            <div style={{display: 'inline-flex', border: '1px solid black', borderRadius: '999px', padding: '4px 12px', fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '24px', whiteSpace: 'nowrap'}}>
              Fragrance-Free Deodorant
            </div>

            <h1 className="text-6xl font-semibold tracking-tight md:text-7xl">NOTHING</h1>

            <p style={{marginTop: '24px', fontSize: '18px', fontWeight: 500, color: '#333'}}>
              Deodorant that does one job: eliminate odor.
            </p>

            <p style={{marginTop: '20px', fontSize: '18px', lineHeight: '1.7', color: '#444'}}>
              {taglines[0]}
            </p>

            <p style={{marginTop: '16px', fontSize: '15px', lineHeight: '1.8', color: '#666'}}>
              Most deodorants try to make you smell like something — ocean breeze, midnight musk, bourbon leather. We do not. We eliminate odor. And add nothing.
            </p>

            <div id="waitlist" style={{marginTop: '32px', background: '#000', borderRadius: '24px', padding: '32px', color: 'white'}}>
              <p style={{fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)'}}>Limited First Run</p>
              <p style={{marginTop: '12px', fontSize: '22px', fontWeight: 600}}>Be first to smell like nothing.</p>
              <p style={{marginTop: '10px', fontSize: '14px', lineHeight: '1.7', color: 'rgba(255,255,255,0.65)'}}>
                Join the waitlist — get early access and launch pricing before anyone else.
              </p>
              <div style={{marginTop: '20px'}}>
                <WaitlistForm dark={true} />
              </div>
              <p style={{marginTop: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)'}}>No spam. Just a heads-up when we launch.</p>
            </div>
          </div>

          <div className="hidden md:flex" style={{alignItems: 'center', justifyContent: 'center'}}>
            <ProductMockup />
          </div>
        </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="mb-14 rounded-[2rem] border border-black/10 bg-neutral-50 p-8 md:p-10">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Deodorant used to solve odor.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-black/70">
            Now it tries to make you smell like:
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {["Mahogany Teakwood", "Arctic Storm", "Coconut Vanilla", "Nothing"].map((item) => (
              <div
                key={item}
                className={`rounded-3xl border p-6 text-center ${
                  item === "Nothing"
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black"
                }`}
              >
                <div className="text-xl font-semibold tracking-tight">{item}</div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-base leading-8 text-black/70">
            We made one that smells like nothing.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Deodorant got weird.</h2>
            <p className="mt-6 max-w-2xl text-base leading-8" style={{color: '#555'}}>
              Walk down the deodorant aisle and you will see dozens of products trying to make you smell like something — coconut vanilla, lavender sage, mahogany teakwood. But a growing number of people are tired of artificial fragrance. They want something radically simple: <b>No odor. No scent. No nonsense.</b>
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" style={{alignContent: 'start'}}>
            {features.map((feature) => (
              <div key={feature} className="rounded-2xl border border-black/10 p-4 shadow-sm">
                <div className="text-sm font-medium">{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-black text-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl" style={{color: '#ffffff'}}>
            Neutralize odor. Do not cover it up.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-7" style={{color: 'rgba(255,255,255,0.75)'}}>
            Sweat is not the problem. Body odor happens when bacteria break sweat down into odor-producing compounds. Nothing targets that process directly with aluminum-free ingredients chosen specifically for odor neutralization.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ingredients.map((item) => (
              <div key={item.name} className="rounded-2xl p-5" style={{border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)'}}>
                <div className="text-base font-medium">{item.name}</div>
                <p className="mt-2 text-sm leading-6" style={{color: 'rgba(255,255,255,0.6)'}}>{item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 lg:px-12">
        <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-8 md:p-10">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            Deodorant names have gotten ridiculous.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Old Spice", "Smell like cedar"],
              ["Native", "Smell like coconut"],
              ["Lume", "Smell like lavender"],
              ["Nothing", "Smell like nothing"],
            ].map(([brand, line]) => (
              <div
                key={brand}
                className={`rounded-[1.5rem] border p-6 ${
                  brand === "Nothing"
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black"
                }`}
              >
                <div
                  className={`text-xs uppercase tracking-[0.3em] ${
                    brand === "Nothing" ? "text-white/55" : "text-black/40"
                  }`}
                >
                  {brand}
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">{line}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-8">
          <div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">The idea is simple.</h2>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {taglines.map((t) => (
            <div key={t} className="rounded-3xl border border-black/10 p-8">
              <p className="text-2xl font-medium leading-9">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 pt-16 md:px-10 lg:px-12">
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            The deodorant aisle got ridiculous.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["Midnight Teakwood", "Arctic Storm", "Coconut Vanilla", "Nothing"].map((item) => (
              <div
                key={item}
                className={`rounded-3xl border p-8 text-center ${
                  item === "Nothing"
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white"
                }`}
              >
                <div className="text-xl font-semibold">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:px-10 lg:px-12">
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Be first to smell like nothing.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-black/70">
            Join the waitlist for the first production run of Nothing.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <WaitlistForm dark={false} />
          </div>
        </div>
      </section>
    </>
  );
}

function ShopPage() {
  const [selectedPack, setSelectedPack] = useState("two");

  const bullets = [
    "24-hour odor-focused daily protection",
    "Aluminum-free formula",
    "Fragrance-free and essential oil-free",
    "Smooth stick application",
    "Designed for people who want to smell like nothing",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 lg:px-12">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ProductMockup />
        </div>

        <div className="flex flex-col">
          <SectionEyebrow>Shop</SectionEyebrow>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Nothing Deodorant Stick</h1>
          <div className="mt-4 flex items-center gap-4">
            <p className="text-2xl font-medium">$16</p>
            <span className="rounded-full bg-black px-3 py-1 text-xs uppercase tracking-[0.25em] text-white">
              Limited first run
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{color: '#555'}}>
            A radically simple deodorant built to neutralize body odor without adding fragrance. No cedar. No musk. No ocean breeze. Just clean, effective daily odor protection for people who want to smell like nothing.
          </p>

          <div className="mt-5 space-y-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="rounded-xl border border-black/10 px-4 py-2 text-sm" style={{color: '#555'}}>
                {bullet}
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPack("one")}
              onKeyDown={(e) => e.key === "Enter" && setSelectedPack("one")}
              className={`rounded-3xl border p-6 text-left transition cursor-pointer ${
                selectedPack === "one"
                  ? "border-black bg-neutral-50 shadow-md ring-2 ring-black/10"
                  : "border-black/10 bg-white hover:border-black/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm uppercase tracking-[0.25em] text-black/50">Single</div>
                  <div className="mt-3 text-2xl font-semibold">1 Stick</div>
                  <div className="mt-1 text-lg">$16</div>
                </div>
                <div
                  className={`mt-1 h-5 w-5 rounded-full border ${
                    selectedPack === "one" ? "border-black bg-black" : "border-black/30 bg-white"
                  }`}
                >
                  <div
                    className={`m-auto mt-1 h-2.5 w-2.5 rounded-full bg-white ${
                      selectedPack === "one" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              </div>
              <button type="button" className="mt-6 w-full rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90">
                Preorder 1 Stick
              </button>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedPack("two")}
              onKeyDown={(e) => e.key === "Enter" && setSelectedPack("two")}
              className={`relative rounded-3xl border p-6 text-left transition cursor-pointer ${
                selectedPack === "two"
                  ? "border-black bg-black text-white shadow-xl ring-2 ring-black/10"
                  : "border-black/10 bg-white hover:border-black/30"
              }`}
            >
              <div
                style={{ animation: "pulse 2.2s ease-in-out infinite" }}
                className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.25em] ${
                  selectedPack === "two" ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Best value
              </div>
              <div className="flex items-start justify-between gap-4 pr-24">
                <div>
                  <div className={`text-sm uppercase tracking-[0.25em] ${selectedPack === "two" ? "text-white/60" : "text-black/50"}`}>
                    Most Popular
                  </div>
                  <div className="mt-3 text-2xl font-semibold">2 Sticks</div>
                  <div className="mt-1 text-lg">$28</div>
                  <div className={`mt-1 text-sm ${selectedPack === "two" ? "text-white/70" : "text-black/60"}`}>
                    Save $4
                  </div>
                </div>
                <div
                  className={`mt-1 h-5 w-5 rounded-full border ${
                    selectedPack === "two"
                      ? "border-white bg-white"
                      : "border-black/30 bg-white"
                  }`}
                >
                  <div
                    className={`m-auto mt-1 h-2.5 w-2.5 rounded-full ${
                      selectedPack === "two" ? "bg-black opacity-100" : "bg-black opacity-0"
                    }`}
                  />
                </div>
              </div>
              <button
                type="button"
                className={`mt-6 w-full rounded-2xl px-6 py-3 text-sm font-medium transition hover:opacity-90 ${
                  selectedPack === "two" ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Preorder 2 Pack
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-black/10 p-5">
              <div className="text-sm font-medium">Unscented by design</div>
              <p className="mt-2 text-sm leading-7 text-black/65">No masking fragrance and no essential oils.</p>
            </div>
            <div className="rounded-3xl border border-black/10 p-5">
              <div className="text-sm font-medium">Clean ingredient philosophy</div>
              <p className="mt-2 text-sm leading-7 text-black/65">
                Built around performance with fewer unnecessary extras.
              </p>
            </div>
            <div className="rounded-3xl border border-black/10 p-5">
              <div className="text-sm font-medium">Gender-neutral</div>
              <p className="mt-2 text-sm leading-7 text-black/65">
                Made for anyone tired of aggressive deodorant scents.
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-8">
          <SectionEyebrow>Launch offer</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">Founding customer bundle</h2>
          <p className="mt-5 text-base leading-8 text-black/70">
            2 sticks for $28 and early access to launch inventory.
          </p>
          <div className="mt-6 rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm text-black/70">
            Limited first production run. Early supporters get first access.
          </div>
        </div>
      </section>
    </div>
  );
}

function HowItWorksPage() {
  const steps = [
    {
      title: "1. Sweat happens",
      body: "Sweat itself is mostly odorless. The problem starts after sweat reaches the skin.",
    },
    {
      title: "2. Bacteria break it down",
      body: "Skin bacteria metabolize sweat compounds into odor-producing molecules.",
    },
    {
      title: "3. Nothing interrupts that process",
      body: "The formula is designed to bind odor compounds, neutralize odor-causing acids, and absorb moisture.",
    },
    {
      title: "4. Result: no extra scent",
      body: "Instead of smelling like fragrance, you simply do not smell like body odor.",
    },
  ];

  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:px-10 lg:px-12 lg:py-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit rounded-full border border-black/20 bg-white px-4 py-1 text-xs uppercase tracking-[0.35em] text-black">
              How It Works
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl" style={{color: '#ffffff'}}>
              The science is simple. The positioning is powerful.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8" style={{color: 'rgba(255,255,255,0.75)'}}>
              Nothing does not try to perfume the problem away. It is built around odor control chemistry and a minimalist ingredient philosophy.
            </p>
          </div>
          <div className="flex items-center justify-center" style={{minHeight: '400px'}}>
            <ProductMockup dark />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {steps.map((step) => (
            <div key={step.title} className="rounded-[2rem] border border-black/10 p-8">
              <div className="text-2xl font-semibold tracking-tight">{step.title}</div>
              <p className="mt-4 text-base leading-8 text-black/70">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
          <SectionEyebrow>Why this matters</SectionEyebrow>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            This is not just unscented. It is anti-fragrance by design.
          </h2>
          <p className="mt-6 text-base leading-8 text-black/70">
            Most brands treat unscented as one SKU in a larger fragrance lineup. Nothing flips that. The absence of scent is the whole point, the whole promise, and the whole identity of the brand.
          </p>
        </div>
      </section>
    </>
  );
}

function IngredientsPage() {
  const ingredients = [
    {
      name: "Zinc Ricinoleate",
      type: "Odor capture",
      body: "A high-value deodorant ingredient known for binding odor molecules so they are less likely to volatilize into the air.",
    },
    {
      name: "Magnesium Hydroxide",
      type: "Odor neutralization",
      body: "Helps neutralize odor-causing acids and creates a more skin-friendly alternative to harsher deodorant systems.",
    },
    {
      name: "Arrowroot Powder",
      type: "Moisture management",
      body: "Absorbs moisture and supports a drier underarm feel without trying to function like an antiperspirant.",
    },
    {
      name: "Candelilla Wax",
      type: "Structure",
      body: "Provides firmness and glide so the product applies like a premium modern deodorant stick.",
    },
    {
      name: "Shea Butter",
      type: "Skin feel",
      body: "Adds softness and helps balance the glide and feel of the formula on daily use.",
    },
    {
      name: "Caprylic/Capric Triglyceride",
      type: "Application support",
      body: "Helps create a clean, smooth application experience while supporting the base system.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
      <SectionEyebrow>Ingredients</SectionEyebrow>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
        Safe, minimalist ingredients chosen to do the job.
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-8 text-black/70">
        The Nothing formula is built around the idea that fewer, smarter ingredients can outperform complicated fragrance-heavy products. Every ingredient should have a purpose.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ingredients.map((item) => (
          <div key={item.name} className="rounded-[2rem] border border-black/10 p-7">
            <div className="text-xs uppercase tracking-[0.3em] text-black/45">{item.type}</div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{item.name}</div>
            <p className="mt-4 text-sm leading-7 text-black/70">{item.body}</p>
          </div>
        ))}
      </div>

      <section className="mt-16 rounded-[2rem] bg-black px-8 py-10 text-white">
        <SectionEyebrow light>What is not inside</SectionEyebrow>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {["No aluminum salts", "No added fragrance", "No essential oils", "No nonsense positioning"].map(
            (item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm text-white/85"
              >
                {item}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
        <SectionEyebrow>About</SectionEyebrow>
        <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl" style={{color: '#0a0a0a'}}>
          This brand started with one honest thought: deodorant should not need to smell like anything.
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-base leading-8 text-black/70">
              Walk down the deodorant aisle and everything is trying to make you smell like something. Ocean breeze. Cedar wood. Midnight musk. Coconut vanilla.
              <br />
              <br />
              Somewhere along the way the goal changed. Deodorant stopped being about eliminating odor and started being about adding fragrance.
              <br />
              <br />
              But a lot of people are quietly thinking the same thing:
              <br />
              <br />
              <b>I do not want to smell like a candle. I just do not want to smell like body odor.</b>
            </p>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-neutral-50 p-8">
            <div className="text-sm font-medium">The idea behind Nothing</div>
            <p className="mt-4 text-base leading-8 text-black/70">
              Nothing is built on a simple philosophy: eliminate odor and add nothing else. No fragrance. No unnecessary scent. Just a clean, effective deodorant designed for people who prefer neutrality over perfume.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
          <SectionEyebrow>Founder Note</SectionEyebrow>
          <div className="mt-6 rounded-[2rem] border border-black/10 bg-white p-10">
            <p className="text-lg leading-8 text-black/80">Why are we making Nothing deodorant?</p>

            <p className="mt-6 text-lg leading-8 text-black/80">Let's make this simple.</p>

            <p className="mt-6 text-lg leading-8 text-black/80">
              A guy at work walked into our office and brought with him an overpowering smell of something that was supposed to smell good. It lingered even after he left.
            </p>

            <p className="mt-6 text-lg leading-8 text-black/80">
              I went on a playful rant with a co-worker about how ridiculous it is that all these deodorants try to make you smell like something — when in reality, most people just want one thing:
            </p>

            <p className="mt-6 text-xl font-semibold">to not smell like body odor.</p>

            <p className="mt-6 text-lg leading-8 text-black/80">That's when it clicked.</p>

            <p className="mt-6 text-xl font-semibold">Nothing was born.</p>

            <p className="mt-8 text-sm text-black/50">— Founder, Nothing</p>
          </div>
        </div>
      </section>

    </>
  );
}

function FAQPage() {
  const faqs = [
    [
      "Does Nothing stop sweating?",
      "No. Nothing is a deodorant, not an antiperspirant. The focus is odor control, not blocking sweat glands.",
    ],
    [
      "Is it truly fragrance-free?",
      "That is the core brand promise. The goal is no added fragrance, no essential oils, and no unnecessary scent masking.",
    ],
    [
      "Who is it for?",
      "Anyone tired of heavily scented deodorant, including fragrance-sensitive users, minimalists, professionals, and people who simply want odor control without the extra smell.",
    ],
    [
      "What makes this different from other unscented deodorants?",
      "Most brands treat unscented as one option in a lineup. Nothing makes the absence of scent the entire identity of the brand.",
    ],
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 lg:px-12 lg:py-20">
      <SectionEyebrow>FAQ</SectionEyebrow>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
        Questions people will ask before they buy.
      </h1>
      <div className="mt-12 space-y-5">
        {faqs.map(([q, a]) => (
          <div key={q} className="rounded-[2rem] border border-black/10 p-7">
            <div className="text-xl font-semibold tracking-tight">{q}</div>
            <p className="mt-4 text-base leading-8 text-black/70">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NothingDeodorantWebsite() {
  const [currentPage, setCurrentPageState] = useState(() => {
    if (typeof window === "undefined") return "Home";
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    return normalizePage(hash || "Home");
  });

  const setCurrentPage = (page) => {
    const nextPage = normalizePage(page);
    setCurrentPageState(nextPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.history.replaceState({}, "", `#${encodeURIComponent(currentPage)}`);
  }, [currentPage]);

  const features = useMemo(
    () => [
      "Aluminum-free",
      "Fragrance-free",
      "No essential oils",
      "Odor neutralizing",
      "Gender-neutral",
      "Minimal ingredients",
    ],
    []
  );

  const ingredients = useMemo(
    () => [
      {
        name: "Zinc Ricinoleate",
        role: "Captures and traps odor molecules before they reach the air.",
      },
      {
        name: "Magnesium Hydroxide",
        role: "Neutralizes odor-causing acids and helps control odor bacteria.",
      },
      {
        name: "Arrowroot Powder",
        role: "Absorbs moisture to help keep underarms dry.",
      },
      {
        name: "Candelilla Wax",
        role: "Creates the smooth deodorant stick structure.",
      },
    ],
    []
  );

  const taglines = useMemo(
    () => [
      "Why smell like anything when you can smell like nothing.",
      "Eliminate odor. Add nothing.",
      "Smell like yourself. Not a candle.",
    ],
    []
  );

  let page;

  if (currentPage === "How It Works") {
    page = <HowItWorksPage />;
  } else if (currentPage === "Ingredients") {
    page = <IngredientsPage />;
  } else if (currentPage === "About") {
    page = <AboutPage />;
  } else if (currentPage === "FAQ") {
    page = <FAQPage />;
  } else {
    page = (
      <HomePage
        features={features}
        ingredients={ingredients}
        taglines={taglines}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  return (
    <SiteShell currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {page}
    </SiteShell>
  );
}
