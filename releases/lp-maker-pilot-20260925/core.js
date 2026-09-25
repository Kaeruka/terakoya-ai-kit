(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.LpCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  "use strict";

  const FIELD_KEYS = [
    "title", "purpose", "audience", "problem", "outcome", "offer", "details",
    "date", "place", "price", "application", "applicationUrl", "host",
    "profile", "proof", "testimonials", "bonus", "faq", "notes"
  ];
  const SECTIONS = [
    ["problem", "悩み・共感"], ["future", "理想の未来"], ["solution", "解決策"],
    ["offer", "講座・サービス内容"], ["benefit", "得られること"],
    ["profile", "講師・主催者"], ["proof", "実績"], ["testimonials", "お客様の声"],
    ["bonus", "特典"], ["outline", "開催・提供概要"], ["faq", "よくある質問"],
    ["cta", "申込案内"]
  ];
  const PRESETS = {
    trust: { label: "信頼感", description: "二列の情報設計と落ち着いた紺", bg: "#f5f8fa", ink: "#162634", accent: "#19688b", soft: "#dcecf2", heading: "Georgia, 'Yu Mincho', serif" },
    friendly: { label: "親しみ", description: "中央に語りかける構成と柔らかな緑", bg: "#f8faf5", ink: "#23372e", accent: "#397a55", soft: "#e6f0df", heading: "'Yu Gothic', Meiryo, sans-serif" },
    future: { label: "未来感", description: "写真に文字を重ねる暗色のヒーロー", bg: "#111722", ink: "#eef7f9", accent: "#81e5e2", soft: "#22313b", heading: "'Yu Gothic', Meiryo, sans-serif" },
    premium: { label: "プレミアム", description: "大きな写真と余白、墨と金", bg: "#f7f5f1", ink: "#292925", accent: "#956d31", soft: "#ede6d9", heading: "Georgia, 'Yu Mincho', serif" },
    cool: { label: "クール", description: "写真先行の左右分割と鋭い青", bg: "#f7f9fc", ink: "#14202d", accent: "#395ec9", soft: "#e6eaf6", heading: "'Yu Gothic', Meiryo, sans-serif" },
    warm: { label: "温かい", description: "余白のある文章と自然な写真", bg: "#fbf7f3", ink: "#382d2b", accent: "#b45c48", soft: "#f4e6de", heading: "Georgia, 'Yu Mincho', serif" },
    business: { label: "ビジネス", description: "結論を早く伝える密度高めの構成", bg: "#f4f6f7", ink: "#17272f", accent: "#26547c", soft: "#e2eaef", heading: "'Yu Gothic', Meiryo, sans-serif" },
    creative: { label: "クリエイティブ", description: "非対称の大胆な見出しと写真", bg: "#f7f9f4", ink: "#262c27", accent: "#4b8255", soft: "#e8f0df", heading: "'Yu Gothic', Meiryo, sans-serif" },
    connection: { label: "つながり", description: "写真から会話へ進む左右の流れ", bg: "#f9f8f8", ink: "#2c3034", accent: "#437b83", soft: "#f5e9e8", heading: "Georgia, 'Yu Mincho', serif" }
  };

  function blankProject() {
    return {
      version: 1,
      fields: Object.fromEntries(FIELD_KEYS.map((key) => [key, ""])),
      sections: Object.fromEntries(SECTIONS.map(([key]) => [key, key === "proof" || key === "testimonials" ? "exclude" : "auto"])),
      sectionNotes: {},
      extraSections: [],
      designs: ["trust", "friendly", "future"],
      referenceUrls: ["", "", ""],
      edits: {},
      heroImage: "",
      designImages: ["", "", ""],
      imageDirections: ["", "", ""],
      pending: [],
      bonusMode: "none",
      bonusIdeaCount: 3,
      sample: false
    };
  }

  function normalizeProject(input) {
    const blank = blankProject();
    if (!input || typeof input !== "object") return blank;
    const fields = Object.fromEntries(FIELD_KEYS.map((key) => [key, String(input.fields?.[key] || "").slice(0, 6000)]));
    const sections = Object.fromEntries(SECTIONS.map(([key]) => [key, ["auto", "include", "exclude"].includes(input.sections?.[key]) ? input.sections[key] : blank.sections[key]]));
    const sectionNotes = Object.fromEntries(SECTIONS.map(([key]) => [key, String(input.sectionNotes?.[key] || "").slice(0, 1500)]));
    const designs = [0, 1, 2].map((i) => PRESETS[input.designs?.[i]] ? input.designs[i] : blank.designs[i]);
    const referenceUrls = [0, 1, 2].map((i) => String(input.referenceUrls?.[i] || "").slice(0, 500));
    const edits = {};
    for (const [key] of SECTIONS) if (typeof input.edits?.[key] === "string") edits[key] = input.edits[key].slice(0, 6000);
    const pending = Array.isArray(input.pending) ? input.pending.slice(0, 20).map((item) => String(item).slice(0, 300)) : [];
    const safeImage = (value) => typeof value === "string" && /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(value) && value.length < 1_000_000 ? value : "";
    const heroImage = safeImage(input.heroImage);
    const designImages = [0, 1, 2].map((index) => safeImage(input.designImages?.[index]));
    const imageDirections = [0, 1, 2].map((index) => String(input.imageDirections?.[index] || "").slice(0, 500));
    const extraSections = Array.isArray(input.extraSections) ? input.extraSections.slice(0, 8).map((item) => ({
      title: String(item?.title || "").slice(0, 80),
      content: String(item?.content || "").slice(0, 2000)
    })) : [];
    const bonusMode = ["none", "existing", "ideas"].includes(input.bonusMode) ? input.bonusMode : "none";
    const bonusIdeaCount = [3, 5].includes(Number(input.bonusIdeaCount)) ? Number(input.bonusIdeaCount) : 3;
    return { version: 1, fields, sections, sectionNotes, extraSections, designs, referenceUrls, edits, heroImage, designImages, imageDirections, pending, bonusMode, bonusIdeaCount, sample: input.sample === true };
  }

  function imageBriefFor(rawProject, index) {
    const project = normalizeProject(rawProject);
    const f = project.fields;
    const subject = String(f.title || f.offer || "入力した題材").trim().replace(/[。.!！?？]+$/u, "").slice(0, 90);
    const audience = f.audience ? `対象は${f.audience.slice(0, 60)}。` : "";
    const compositions = {
      trust: "自然光の中で題材に関わる手元や道具を正確に見せ、文字を置く余白を残す",
      friendly: "題材に取り組む場面を近い距離で捉え、表情や手元に親しみを出す",
      future: "題材を象徴する物や成果物を暗めの空間で大胆に切り取り、見出しを重ねる余白を残す",
      premium: "題材を象徴する一点を上質な静物写真として写し、質感と広い余白を見せる",
      cool: "題材に関わる具体的な物をシャープな光で撮り、左右分割に合う構図にする",
      warm: "題材に取り組む手元や道具を柔らかな光で写し、日常の温度を出す",
      business: "題材の実務場面や成果物を明瞭に写し、要点がすぐ伝わる構図にする",
      creative: "題材を象徴する物の形や色を大胆に切り取り、非対称な構図にする",
      connection: "題材に関わる対話や共同作業の場面を自然に捉え、視線の流れをつくる"
    };
    return `「${subject}」のLP用。${audience}${compositions[project.designs[index]]}。実在の人物・会場・実績の証拠にはしない。`;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function text(value) { return String(value || "").trim(); }
  function lines(value) { return text(value).split(/\r?\n/).map((line) => line.trim()).filter(Boolean); }
  function paragraphs(value) { return lines(value).map((line) => `<p>${esc(line)}</p>`).join(""); }
  function validHttpUrl(value) {
    try { const url = new URL(text(value)); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; }
    catch { return ""; }
  }
  function allowed(project, key, hasMaterial) {
    const mode = project.sections[key];
    if (mode === "exclude") return false;
    if (key === "proof" || key === "testimonials") return mode === "include" && hasMaterial;
    return hasMaterial || mode === "include";
  }

  function contentFor(project, key) {
    const f = project.fields;
    if (Object.prototype.hasOwnProperty.call(project.edits, key)) return project.edits[key];
    const content = {
      problem: f.problem,
      future: f.outcome,
      solution: f.offer,
      offer: [f.offer, f.details].filter(Boolean).join("\n"),
      benefit: f.outcome,
      profile: [f.host, f.profile].filter(Boolean).join("\n"),
      proof: f.proof,
      testimonials: f.testimonials,
      bonus: project.bonusMode === "existing" ? f.bonus : "",
      outline: [f.date && `日時: ${f.date}`, f.place && `場所・形式: ${f.place}`, f.price && `価格: ${f.price}`].filter(Boolean).join("\n"),
      faq: f.faq,
      cta: f.application || (f.applicationUrl ? "お申し込みはこちら" : "受付準備中")
    };
    return content[key] || "";
  }

  function issues(project) {
    const f = project.fields;
    const list = [];
    for (const [key, label] of [["title", "商品・セミナー名"], ["audience", "対象者"], ["offer", "提供内容"]]) {
      if (!text(f[key])) list.push(`${label}が未入力です`);
    }
    for (const key of ["proof", "testimonials"]) {
      if (project.sections[key] === "include" && !text(f[key])) list.push(`${SECTIONS.find(([id]) => id === key)[1]}の実際の素材が必要です`);
    }
    if (text(f.applicationUrl) && !validHttpUrl(f.applicationUrl)) list.push("申込URLは http または https で入力してください");
    if (!validHttpUrl(f.applicationUrl)) list.push("申込リンク未設定のため、公開用の申込ボタンは表示しません");
    list.push(...project.pending);
    return list;
  }

  function buildHtml(rawProject, presetId, heroImage = "") {
    const project = normalizeProject(rawProject);
    const preset = PRESETS[presetId] || PRESETS.trust;
    const f = project.fields;
    const title = text(f.title) || "LP初稿";
    const subtitle = text(f.audience) ? `${f.audience}へ` : "";
    const href = validHttpUrl(f.applicationUrl);
    const commonEnd = ["profile", "proof", "testimonials", "bonus", "outline", "faq", "cta"];
    const narrative = ["friendly", "warm", "connection"].includes(presetId)
      ? ["future", "problem", "benefit", "solution", "offer"]
      : ["future", "cool", "creative"].includes(presetId)
        ? ["offer", "benefit", "problem", "solution", "future"]
        : ["problem", "future", "solution", "offer", "benefit"];
    const order = [...narrative, ...commonEnd];
    const sectionMarkup = order.map((key, i) => {
      const label = SECTIONS.find(([id]) => id === key)[1];
      const content = contentFor(project, key);
      if (!allowed(project, key, text(content))) return "";
      if (key === "cta") {
        return `<section class="section cta" id="apply"><p class="eyebrow">NEXT STEP</p><h2>${esc(label)}</h2>${paragraphs(content)}${href ? `<a class="button" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(f.application || "申し込む")}</a>` : '<span class="button disabled" aria-disabled="true">受付準備中</span><p>［申込URL：未定］</p>'}</section>`;
      }
      return `<section class="section ${i % 2 ? "alternate" : ""}" id="${key}"><div class="section-inner"><div class="section-title"><p class="eyebrow">${String(i + 1).padStart(2, "0")}</p><h2>${esc(label)}</h2></div><div class="section-body">${paragraphs(content)}</div></div></section>`;
    }).join("");
    const extras = project.extraSections.filter((s) => text(s.title) && text(s.content)).map((s) => `<section class="section"><div class="section-inner"><div class="section-title"><p class="eyebrow">MORE</p><h2>${esc(s.title)}</h2></div><div class="section-body">${paragraphs(s.content)}</div></div></section>`).join("");
    const imageSource = heroImage || project.heroImage;
    const safeImage = /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(imageSource) && imageSource.length < 1_000_000 ? imageSource : "";
    const cover = safeImage ? `<figure class="lp-cover"><img src="${safeImage}" alt="講座・サービスのイメージ写真"><figcaption>提供画像</figcaption></figure>` : '<figure class="lp-cover placeholder"><span>画像</span></figure>';
    const header = project.sample ? '<div class="sample">テスト用・架空情報</div>' : "";
    const dark = presetId === "future";
    return `<!doctype html>\n<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="${dark ? "dark" : "light"}"><title>${esc(title)} | LP初稿</title><style>
.lp-cover.placeholder{display:grid;place-items:center;background:${preset.soft};border:1px solid ${preset.accent}44;color:${preset.ink}88}.lp-cover.placeholder span{font-size:20px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:${preset.bg};color:${preset.ink};font-family:'Yu Gothic',Meiryo,sans-serif;line-height:1.75}a{color:inherit}p{margin:0 0 1em}.sample{background:${preset.accent};color:${dark ? "#11222a" : "#fff"};text-align:center;padding:7px;font-size:13px;font-weight:700}.shell{max-width:1180px;margin:auto;padding:0 32px}.top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 0;border-bottom:1px solid ${preset.accent}55}.brand{font-weight:800;font-size:14px}.top a{text-decoration:none;font-size:13px}.hero{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);min-height:490px;gap:34px;align-items:stretch;padding:34px 0 45px;border-bottom:1px solid ${preset.accent}66}.hero-copy{position:relative;z-index:2;display:flex;flex-direction:column;justify-content:center;min-width:0}.eyebrow{font-size:12px;font-weight:800;color:${preset.accent};letter-spacing:0}.hero h1{font:700 clamp(34px,4.6vw,64px)/1.25 ${preset.heading};max-width:850px;margin:14px 0 22px;overflow-wrap:anywhere}.hero .lede{font-size:18px;max-width:640px}.hero .meta{font-size:14px;opacity:.8;margin-top:24px}.lp-cover{position:relative;min-height:380px;margin:0;overflow:hidden}.lp-cover img{display:block;width:100%;height:100%;position:absolute;inset:0;object-fit:cover}.lp-cover figcaption{position:absolute;right:12px;bottom:10px;padding:3px 7px;background:#000a;color:white;font-size:11px}.hero:not(:has(.lp-cover)){grid-template-columns:1fr;min-height:330px}.hero:not(:has(.lp-cover)) .hero-copy{min-height:300px}.section{padding:64px 0;border-bottom:1px solid ${preset.accent}33}.section.alternate{background:${preset.soft};padding-left:24px;padding-right:24px}.section-inner{display:grid;grid-template-columns:minmax(0,.37fr) minmax(0,.63fr);gap:36px;align-items:start}.section h2{font:700 clamp(25px,3vw,38px)/1.35 ${preset.heading};margin:8px 0 0}.section p{max-width:760px;font-size:16px;white-space:pre-wrap;overflow-wrap:anywhere}.section-body{padding-top:22px}.cta{text-align:center}.cta .section-inner{display:block}.cta p{margin-left:auto;margin-right:auto}.button{display:inline-block;background:${preset.accent};color:${dark ? "#11222a" : "#fff"};text-decoration:none;padding:15px 36px;font-weight:800;margin-top:16px}.button.disabled{opacity:.55;cursor:default}footer{padding:38px 0;font-size:13px;opacity:.7}
body[data-design="trust"] .hero{grid-template-columns:1fr 1fr}body[data-design="trust"] .hero-copy{padding-left:24px;border-left:5px solid ${preset.accent}}body[data-design="trust"] .lp-cover img{object-position:65% center}body[data-design="trust"] .section-title{border-top:3px solid ${preset.accent};padding-top:15px}
body[data-design="friendly"] .hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px}body[data-design="friendly"] .hero-copy{max-width:760px;min-height:280px}body[data-design="friendly"] .lp-cover{width:100%;height:320px;min-height:320px}body[data-design="friendly"] .section-inner{display:block;max-width:730px;margin:auto;text-align:center}body[data-design="friendly"] .section-body{padding-top:12px}body[data-design="friendly"] .section p{margin-left:auto;margin-right:auto}
body[data-design="future"] .hero{display:flex;align-items:end;min-height:560px;padding:48px;overflow:hidden;background:#102630;color:#fff}body[data-design="future"] .hero-copy{max-width:620px;min-height:440px;justify-content:end}body[data-design="future"] .hero h1{font-size:clamp(42px,5.4vw,78px)}body[data-design="future"] .hero .eyebrow{color:#9df8ed}body[data-design="future"] .lp-cover{position:absolute;inset:0;min-height:0}body[data-design="future"] .lp-cover:after{content:"";position:absolute;inset:0;background:#0b172ac2}body[data-design="future"] .lp-cover figcaption{z-index:1}body[data-design="future"] .section-inner{grid-template-columns:1fr 1fr}body[data-design="future"] .section:nth-of-type(even){border-left:5px solid ${preset.accent}}
body[data-design="premium"] .hero{display:flex;flex-direction:column;padding-top:20px;gap:26px}body[data-design="premium"] .lp-cover{order:-1;width:100%;height:440px}body[data-design="premium"] .hero-copy{text-align:center;align-items:center;min-height:230px}body[data-design="premium"] .hero h1{max-width:790px;font-size:clamp(40px,5.2vw,72px)}body[data-design="premium"] .section-inner{display:block;max-width:680px;margin:auto}body[data-design="premium"] .section-title{border-bottom:1px solid ${preset.accent};padding-bottom:18px}body[data-design="premium"] .section-body{padding-top:24px}
body[data-design="cool"] .lp-cover{order:-1}body[data-design="cool"] .hero{grid-template-columns:1fr 1fr;gap:0}body[data-design="cool"] .hero-copy{padding:40px;border-top:8px solid ${preset.accent};background:#fff}body[data-design="cool"] .hero h1{font-family:'Yu Gothic',Meiryo,sans-serif;font-weight:900}body[data-design="cool"] .section-inner{grid-template-columns:1fr 1fr}body[data-design="cool"] .section.alternate{background:#fff;border-top:3px solid ${preset.accent}}
body[data-design="warm"] .hero{display:flex;flex-direction:column;align-items:center;text-align:center}body[data-design="warm"] .hero-copy{max-width:770px;min-height:240px}body[data-design="warm"] .lp-cover{height:380px;min-height:380px;width:min(860px,100%);border:12px solid #fff}body[data-design="warm"] .section-inner{display:block;max-width:750px;margin:auto}body[data-design="warm"] .section-title{text-align:center}body[data-design="warm"] .section-body{padding-top:18px}
body[data-design="business"] .hero{grid-template-columns:1.2fr .8fr;min-height:390px}body[data-design="business"] .hero-copy{border-top:4px solid ${preset.accent};padding-top:26px}body[data-design="business"] .hero h1{font-size:clamp(34px,4vw,55px)}body[data-design="business"] .lp-cover{min-height:300px}body[data-design="business"] .section{padding:38px 0}body[data-design="business"] .section-inner{grid-template-columns:220px 1fr;gap:26px}body[data-design="business"] .section h2{font-size:26px}
body[data-design="creative"] .hero{grid-template-columns:.8fr 1.2fr;min-height:520px;gap:0}body[data-design="creative"] .hero-copy{margin-right:-110px;padding:35px 35px 35px 0}body[data-design="creative"] .hero h1{font:900 clamp(44px,5.8vw,82px)/1.1 'Yu Gothic',Meiryo,sans-serif;background:${preset.bg};padding:6px 18px 10px 0}body[data-design="creative"] .lp-cover img{object-position:70% center}body[data-design="creative"] .section-inner{grid-template-columns:1fr 1fr}body[data-design="creative"] .section:nth-of-type(even) .section-inner{direction:rtl}body[data-design="creative"] .section:nth-of-type(even) .section-inner>*{direction:ltr}
body[data-design="connection"] .hero{grid-template-columns:.95fr 1.05fr;gap:50px}body[data-design="connection"] .lp-cover{order:-1;margin:22px 0 22px 25px}body[data-design="connection"] .hero-copy{padding-right:32px}body[data-design="connection"] .section-inner{display:block;max-width:730px;margin:auto}body[data-design="connection"] .section-title{border-left:4px solid ${preset.accent};padding-left:24px}body[data-design="connection"] .section-body{padding-left:28px}
@media(max-width:650px){.shell{padding:0 20px}.hero{display:flex!important;flex-direction:column;gap:18px;min-height:0;padding:35px 0}.hero-copy{min-height:0!important;padding:0!important;margin:0!important}.hero h1{font-size:clamp(32px,9vw,48px)!important;padding:0!important}.hero .lede{font-size:16px}.lp-cover{width:100%!important;height:230px!important;min-height:230px!important;margin:0!important;border-width:5px!important}body[data-design="future"] .hero{min-height:460px;padding:25px}body[data-design="future"] .hero-copy{justify-content:end;flex:1}body[data-design="future"] .lp-cover{position:absolute;height:auto!important;inset:0}body[data-design="premium"] .lp-cover,body[data-design="cool"] .lp-cover,body[data-design="connection"] .lp-cover{order:-1}.section{padding:44px 0}.section.alternate{padding-left:16px;padding-right:16px}.section-inner{display:block!important}.section-body{padding-top:14px}.section h2{font-size:27px}.cta{text-align:center}}
</style></head><body data-design="${presetId}">${header}<div class="shell"><header class="top"><div class="brand">${esc(f.host || title)}</div><a href="#apply">申込案内</a></header><main><section class="hero"><div class="hero-copy"><p class="eyebrow">${esc(preset.label)} / ${esc(f.purpose || "LP初稿")}</p><h1>${esc(title)}</h1>${subtitle ? `<p class="lede">${esc(subtitle)}</p>` : ""}${text(f.outcome) ? `<p class="lede">${esc(f.outcome)}</p>` : ""}${text(f.date) ? `<p class="meta">${esc(f.date)}</p>` : ""}</div>${cover}</section>${sectionMarkup}${extras}</main><footer>${esc(f.host || title)} · 公開前に事実とリンクをご確認ください</footer></div></body></html>`;
  }

  function buildWorkPrompt(rawProject) {
    const project = normalizeProject(rawProject);
    const payload = {
      fields: project.fields,
      sections: project.sections,
      sectionNotes: project.sectionNotes,
      extraSections: project.extraSections,
      designs: project.designs.map((id, index) => ({ id, label: PRESETS[id].label, description: PRESETS[id].description, imageDirection: text(project.imageDirections[index]) || imageBriefFor(project, index) })),
      imageStatus: { sharedProvided: Boolean(project.heroImage), perDesignProvided: project.designImages.map(Boolean) },
      referenceUrls: project.referenceUrls.filter((url) => validHttpUrl(url)),
      existingEdits: project.edits,
      pending: project.pending,
      bonusMode: project.bonusMode,
      bonusIdeaCount: project.bonusIdeaCount,
      sample: project.sample
    };
    const instructions = [
      "あなたは寺子屋AIワークショップのLP制作担当です。以下の入力JSONだけを事実の根拠にしてください。",
      "制作前の確認質問や構成案だけの返答は不要です。入力JSONを受け取ったら質問を返さず、未定事項は省略または『準備中』として、その最初の返答で成果物まで進めてください。",
      "1回の依頼でLP完成候補3案をまとめて制作し、lp-01.html・lp-02.html・lp-03.htmlを別々に保存してください。案ごとの確認待ちや1案ずつの返答を挟まず、3案がそろってからURLまたはファイルを返してください。可能なら各案の画像生成を並行して進め、その間にHTMLも組み立ててください。内部の並列実行ができない環境でも3案を一度の依頼で完成させてください。",
      "未定・未入力項目は質問で止めず、省略または『未定』『受付準備中』と表示してください。講師欄・録画配布・キャンセル条件・実績・お客様の声は、根拠となる入力がなければ掲載しません。架空のURLや事実を補いません。",
      "入力JSONのsampleがtrueなら、全案の最上部に『テスト用・架空情報』と明記し、実際の募集や販売に使える状態と誤認させないでください。",
      "3案は同じ型の色違いにせず、ヒーロー構成、本文の段組み、画像の位置と大きさ、見出しの強弱、余白、情報順序を選択した方向性ごとに変えてください。designsのimageDirectionを各案の画像方針として使い、内容に合う画像を3案それぞれ生成して実際にHTMLへ配置してください。画像生成が使えない場合は無関係な写真で埋めず、写真なしで成立する完成LP3案を返し、画像のみ未生成と明記してください。スマートフォンの本文は16px以上にします。",
      "imageStatusはローカル画面で写真が指定されているかの記録だけです。画像データはこの依頼文に含まれません。同じ写真をWork版に使う場合は本人が別途添付する必要があります。",
      "個別指示を優先し、構成のautoは必要性を判断、includeは入れる、excludeは入れないでください。実績・口コミ・価格・日時・定員・割引・保証・講師情報などの事実を創作しないでください。特典案は採用前にLPへ掲載しません。",
      "申込URLがなければ無効な『受付準備中』を表示し、リンクは作りません。参考LPは特徴のみ参考にして、文章や画像を複製しません。外部公開・デプロイ・SNS投稿はしません。",
      "3案のHTMLのほか、要確認事項を短く添えてください。設計意図や素材案だけで回答を終えず、まず成果物を完成させてください。"
    ];
    return `${instructions.join("\n\n")}\n\n入力JSON:\n${JSON.stringify(payload, null, 2)}`;
  }

  return { FIELD_KEYS, SECTIONS, PRESETS, blankProject, normalizeProject, imageBriefFor, validHttpUrl, issues, buildHtml, buildWorkPrompt, contentFor };
});
