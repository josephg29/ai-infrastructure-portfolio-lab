import fs from "node:fs/promises";

const OUTPUT = new URL("./ai_infrastructure_portfolios.html", import.meta.url);

const SOURCES = {
  nasdaq: {
    label: "Nasdaq real-time quote and summary endpoints",
    url: "https://www.nasdaq.com/market-activity/stocks",
    note: "Used for last sale, change, bid/ask, volume, 52-week range, market cap, dividend fields, and company descriptions where available."
  },
  ieaDemand: {
    label: "IEA Energy and AI - Executive summary",
    url: "https://www.iea.org/reports/energy-and-ai/executive-summary",
    note: "Data center electricity consumption is projected to more than double to about 945 TWh by 2030, with AI as the most important driver."
  },
  ieaSupply: {
    label: "IEA Energy and AI - Energy supply for AI",
    url: "https://www.iea.org/reports/energy-and-ai/energy-supply-for-ai",
    note: "Global electricity generation for data centers is projected to grow from 460 TWh in 2024 to over 1,000 TWh by 2030 and 1,300 TWh by 2035."
  },
  nvidiaQ1: {
    label: "NVIDIA Q1 FY2027 results",
    url: "https://nvidianews.nvidia.com/news/nvidia-announces-financial-results-for-first-quarter-fiscal-2027",
    note: "Record Q1 FY2027 revenue of $81.6B and Data Center revenue of $75.2B."
  },
  amdQ1: {
    label: "AMD Q1 2026 results",
    url: "https://ir.amd.com/news-events/press-releases/detail/1284/amd-reports-first-quarter-2026-financial-results",
    note: "Q1 revenue of $10.3B; Data Center revenue of $5.8B, up 57% year over year."
  },
  broadcomQ2: {
    label: "Broadcom Q2 FY2026 results",
    url: "https://www.prnewswire.com/news-releases/broadcom-inc-announces-second-quarter-fiscal-year-2026-financial-results-and-quarterly-dividend-302790698.html",
    note: "Q2 AI semiconductor revenue of $10.8B, up 143% year over year."
  },
  marvellQ1: {
    label: "Marvell Q1 FY2027 results",
    url: "https://investor.marvell.com/news-events/press-releases/detail/1023/marvell-technology-inc-reports-first-quarter-of-fiscal-year-2027-financial-results",
    note: "Record Q1 FY2027 revenue of $2.418B, with continued strength expected from data center."
  },
  tsmcQ1: {
    label: "TSMC 2026 Q1 results",
    url: "https://investor.tsmc.com/english/quarterly-results/2026/q1",
    note: "Q1 2026 net revenue of $35.90B and Q2 guidance of $39.0B-$40.2B."
  },
  asmlQ1: {
    label: "ASML Q1 2026 results",
    url: "https://www.asml.com/news/press-releases/2026/q1-2026-financial-results",
    note: "Q1 net sales of EUR8.8B and 2026 net sales guidance of EUR36B-EUR40B."
  },
  amatQ2: {
    label: "Applied Materials Q2 2026 results",
    url: "https://ir.appliedmaterials.com/news-releases/news-release-details/applied-materials-announces-second-quarter-2026-results",
    note: "Q2 FY2026 revenue of $7.91B, up 11% year over year."
  },
  klaQ3: {
    label: "KLA Q3 FY2026 results",
    url: "https://ir.kla.com/news-events/press-releases/detail/514/kla-corporation-reports-fiscal-2026-third-quarter-results",
    note: "Fiscal Q3 2026 revenue of $3.415B; process control remains central to advanced chip production."
  },
  aristaFY: {
    label: "Arista 2025 full-year results",
    url: "https://investors.arista.com/Communications/Press-Releases-and-Events/Press-Release-Detail/2026/Arista-Networks-Inc--Reports-Fourth-Quarter-and-Year-End-2025-Financial-Results/default.aspx",
    note: "2025 revenue of $9.006B, up 28.6%."
  },
  microsoftQ3: {
    label: "Microsoft FY2026 Q3 results",
    url: "https://www.microsoft.com/en-us/investor/earnings/fy-2026-q3/press-release-webcast",
    note: "FY26 Q3 revenue of $82.9B; Microsoft Cloud and AI strength drove results."
  },
  alphabetQ1: {
    label: "Alphabet Q1 2026 results",
    url: "https://www.sec.gov/Archives/edgar/data/1652044/000165204426000043/googexhibit991q12026.htm",
    note: "Q1 2026 revenue of $109.9B, up 22% year over year."
  },
  amazonQ1: {
    label: "Amazon Q1 2026 results",
    url: "https://ir.aboutamazon.com/news-release/news-release-details/2026/Amazon-com-Announces-First-Quarter-Results/default.aspx",
    note: "AWS Q1 2026 sales of $37.6B, up 28% year over year."
  },
  oracleFY: {
    label: "Oracle Q4 and FY2026 results",
    url: "https://investor.oracle.com/investor-news/news-details/2026/Oracle-Announces-Record-Q4-and-FY-2026-Results-Driven-by-Cloud-Infrastructure--Cloud-Applications/default.aspx",
    note: "FY2026 cloud infrastructure revenue of $18.1B, up 77%; RPO reached $638B."
  },
  coreweaveQ1: {
    label: "CoreWeave Q1 2026 results",
    url: "https://investors.coreweave.com/news/news-details/2026/CoreWeave-Reports-Strong-First-Quarter-2026-Results/",
    note: "Q1 revenue of $2.078B; revenue backlog reached $99.4B."
  },
  digitalRealtyQ1: {
    label: "Digital Realty Q1 2026 results",
    url: "https://investor.digitalrealty.com/news-releases/news-release-details/digital-realty-reports-first-quarter-2026-results",
    note: "Q1 total revenue of $1.6B; total bookings of $707M annualized GAAP base rent at 100% share."
  },
  equinixQ1: {
    label: "Equinix Q1 2026 results",
    url: "https://newsroom.equinix.com/2026-04-29-Equinix-Reports-First-Quarter-Results-and-Raises-Full-Year-Financial-Outlook",
    note: "Q1 revenue of $2.444B, up 10%, and raised full-year outlook."
  },
  vertivQ1: {
    label: "Vertiv Q1 2026 results and AI data center presentation",
    url: "https://investors.vertiv.com/financials/quarterly-results/default.aspx",
    note: "Q1 2026 materials highlight power and thermal infrastructure for AI data centers."
  },
  eatonQ1: {
    label: "Eaton Q1 2026 results",
    url: "https://www.eaton.com/us/en-us/company/news-insights/news-releases/2026/eaton-reports-record-first-quarter-2026-results.html",
    note: "Record Q1 2026 results with accelerating sales, orders, backlog, and higher organic growth guidance."
  },
  geVernovaQ1: {
    label: "GE Vernova Q1 2026 results",
    url: "https://www.gevernova.com/news/press-releases/ge-vernova-reports-first-quarter-2026-financial",
    note: "Electrification booked $2.4B in equipment orders to support data centers in the quarter."
  },
  quantaQ1: {
    label: "Quanta Services Q1 2026 results",
    url: "https://investors.quantaservices.com/news-events/press-releases/detail/396/quanta-services-reports-first-quarter-2026-results",
    note: "Q1 2026 revenue of $7.9B; infrastructure backlog and grid/data center exposure."
  },
  constellationPPA: {
    label: "Constellation and Microsoft 20-year power purchase agreement",
    url: "https://www.constellationenergy.com/news/2024/Constellation-to-Launch-Crane-Clean-Energy-Center-Restoring-Jobs-and-Carbon-Free-Power-to-The-Grid.html",
    note: "Agreement supports restart of Three Mile Island Unit 1 as the Crane Clean Energy Center."
  },
  dellFY: {
    label: "Dell FY2026 results",
    url: "https://investors.delltechnologies.com/news-releases/news-release-details/dell-technologies-delivers-fourth-quarter-and-full-year-fiscal-3",
    note: "Fiscal 2026 results included record quarterly AI-optimized server revenue of $9.0B in Q4."
  }
};

const SECURITIES = [
  {
    ticker: "NVDA",
    name: "NVIDIA",
    assetClass: "stocks",
    layer: "Compute silicon",
    risk: "High",
    role: "Dominant accelerated-compute platform for training, inference, networking, and AI factory systems.",
    thesis: "NVIDIA remains the cleanest pure-play on AI infrastructure because it captures value across GPUs, systems, networking, software, and increasingly reference architecture. Its scale and CUDA ecosystem are still the center of the AI capex cycle.",
    bull: ["Record data center revenue and margin power", "Full-stack platform across GPUs, networking, and AI factory software", "Strong roadmap cadence from Blackwell into Vera Rubin"],
    risks: ["Valuation leaves little room for disappointment", "Export controls and China restrictions can affect revenue mix", "Hyperscalers may diversify to custom silicon over time", "Supply chain concentration at leading-edge foundries"],
    watch: ["Data center revenue growth", "Gross margin durability", "Networking attach rates", "Large cloud customer concentration"],
    scores: [5, 5, 5, 5, 4],
    sources: ["nvidiaQ1", "nasdaq"]
  },
  {
    ticker: "AVGO",
    name: "Broadcom",
    assetClass: "stocks",
    layer: "Custom silicon and networking",
    risk: "Medium-High",
    role: "Custom AI accelerators, networking silicon, connectivity, and infrastructure software.",
    thesis: "Broadcom is the leading alternative path for hyperscalers that want custom XPUs and networking silicon. It is less pure than NVIDIA, but AI semiconductors are now a major growth engine.",
    bull: ["Large hyperscaler custom silicon relationships", "AI networking and Ethernet exposure", "Highly profitable infrastructure software base"],
    risks: ["Customer concentration in custom silicon", "VMware integration and debt still matter", "AI revenue expectations have become demanding", "Potential margin mix changes as hardware ramps"],
    watch: ["AI semiconductor revenue", "Custom accelerator customer wins", "Networking growth", "Free cash flow and debt reduction"],
    scores: [5, 4, 5, 4, 3],
    sources: ["broadcomQ2", "nasdaq"]
  },
  {
    ticker: "AMD",
    name: "Advanced Micro Devices",
    assetClass: "stocks",
    layer: "Compute silicon",
    risk: "High",
    role: "GPU and CPU challenger in AI servers, cloud instances, inference, and enterprise compute.",
    thesis: "AMD offers a more competitive, higher-volatility way to own AI accelerators and server CPUs. The setup depends on continued Instinct GPU traction and EPYC share gains.",
    bull: ["Data Center is now the primary growth driver", "EPYC CPUs remain strong in cloud and enterprise", "MI450 and rack-scale Helios could expand AI GPU share"],
    risks: ["NVIDIA ecosystem lead is still large", "AI GPU ramps require software maturity", "Memory and packaging supply constraints", "Execution risk in large deployments"],
    watch: ["Data Center segment revenue", "Instinct GPU pipeline", "Cloud instance adoption", "Non-GAAP gross margin"],
    scores: [5, 3, 4, 4, 4],
    sources: ["amdQ1", "nasdaq"]
  },
  {
    ticker: "TSM",
    name: "Taiwan Semiconductor Manufacturing",
    assetClass: "stocks",
    layer: "Foundry and packaging",
    risk: "Medium-High",
    role: "Leading foundry for advanced logic, AI accelerators, high-performance compute, and advanced packaging.",
    thesis: "TSMC is the manufacturing bottleneck behind many AI winners. It is less glamorous than GPU brands, but it is essential to leading-edge capacity, yields, and advanced packaging.",
    bull: ["Dominant advanced-node foundry position", "HPC and AI accelerator demand", "Pricing and utilization benefits from scarce leading-edge capacity"],
    risks: ["Taiwan geopolitical risk", "Capex intensity", "Currency and ADR considerations", "Customer concentration in mega-cap AI names"],
    watch: ["HPC revenue mix", "CoWoS and advanced packaging capacity", "2nm ramp", "Capex and gross margin guidance"],
    scores: [5, 5, 5, 3, 3],
    sources: ["tsmcQ1", "nasdaq"]
  },
  {
    ticker: "ASML",
    name: "ASML",
    assetClass: "stocks",
    layer: "Semiconductor equipment",
    risk: "Medium-High",
    role: "Near-monopoly supplier of EUV lithography equipment for advanced semiconductors.",
    thesis: "ASML is the tollbooth for the most advanced chipmaking transitions. AI demand supports long-term equipment intensity, though export restrictions and cyclical order timing still matter.",
    bull: ["Unique EUV position", "AI-driven advanced-node capacity expansion", "High-NA EUV optionality"],
    risks: ["China export controls", "Lumpy bookings and customer capex cycles", "High valuation", "European ADR currency exposure"],
    watch: ["Net bookings", "EUV and High-NA shipments", "2026 revenue guidance", "China mix"],
    scores: [4, 5, 5, 4, 3],
    sources: ["asmlQ1", "nasdaq"]
  },
  {
    ticker: "AMAT",
    name: "Applied Materials",
    assetClass: "stocks",
    layer: "Semiconductor equipment",
    risk: "Medium",
    role: "Broad wafer fabrication equipment exposure across logic, memory, packaging, and services.",
    thesis: "Applied Materials is a diversified way to own chip manufacturing intensity. AI servers pull through advanced logic, HBM, DRAM, and advanced packaging complexity.",
    bull: ["Broad exposure across the wafer fab equipment stack", "Services and spares create recurring support", "AI and HBM raise process complexity"],
    risks: ["Semiconductor equipment cycles are volatile", "Export restrictions", "Customer capex digestion periods", "Competition across equipment categories"],
    watch: ["Semiconductor systems revenue", "Services growth", "China exposure", "Memory and advanced packaging demand"],
    scores: [4, 4, 5, 3, 3],
    sources: ["amatQ2", "nasdaq"]
  },
  {
    ticker: "LRCX",
    name: "Lam Research",
    assetClass: "stocks",
    layer: "Semiconductor equipment",
    risk: "Medium-High",
    role: "Etch, deposition, and advanced packaging equipment for memory and leading-edge chips.",
    thesis: "Lam is a strong AI infrastructure derivative when HBM, DRAM, NAND, and advanced packaging investment accelerates. It is more cyclical than the end-demand story looks.",
    bull: ["Memory and HBM process intensity", "Advanced packaging exposure", "High service attach to installed base"],
    risks: ["Memory capex cycles", "Export restrictions", "Customer concentration", "Order timing volatility"],
    watch: ["WFE outlook", "Memory capex recovery", "Advanced packaging revenue", "China controls"],
    scores: [4, 4, 4, 3, 4],
    sources: ["nasdaq", "amatQ2"]
  },
  {
    ticker: "KLAC",
    name: "KLA",
    assetClass: "stocks",
    layer: "Semiconductor equipment",
    risk: "Medium",
    role: "Process control, inspection, and metrology for leading-edge semiconductor manufacturing.",
    thesis: "KLA benefits when fabs push the edge of physics. More process steps, advanced packaging, and yield pressure make inspection and metrology more important.",
    bull: ["Process control is critical to yield", "High margins and installed-base strength", "Advanced nodes increase inspection intensity"],
    risks: ["Fab equipment cyclicality", "China export controls", "Customer capex timing", "Valuation can compress in downcycles"],
    watch: ["Process control revenue", "Service revenue", "Advanced logic and memory demand", "Gross margin"],
    scores: [4, 4, 5, 3, 3],
    sources: ["klaQ3", "nasdaq"]
  },
  {
    ticker: "MU",
    name: "Micron Technology",
    assetClass: "stocks",
    layer: "Memory and storage",
    risk: "High",
    role: "DRAM, NAND, and high-bandwidth memory supplier for AI servers.",
    thesis: "AI turns memory from a commodity afterthought into a strategic bottleneck. Micron offers high upside to HBM and DRAM pricing, but this remains a cyclical memory business.",
    bull: ["HBM demand from AI accelerators", "Tight memory supply environment", "Operating leverage in upcycles"],
    risks: ["Memory pricing can reverse sharply", "Capex cycles and inventory corrections", "Competition from SK Hynix and Samsung", "Very high earnings cyclicality"],
    watch: ["HBM share and qualification", "DRAM pricing", "Inventory trends", "Capex discipline"],
    scores: [5, 3, 3, 3, 5],
    sources: ["nasdaq", "amdQ1"]
  },
  {
    ticker: "MRVL",
    name: "Marvell Technology",
    assetClass: "stocks",
    layer: "Networking and custom silicon",
    risk: "High",
    role: "Data center networking, optical DSPs, custom silicon, and interconnect.",
    thesis: "Marvell sits in the pipes between AI chips. Its data center growth depends on optical networking, custom silicon, and high-speed switching demand.",
    bull: ["AI data center interconnect demand", "Custom silicon partnerships", "Optical and DSP exposure"],
    risks: ["Customer concentration", "Execution risk in custom silicon", "Valuation sensitivity", "Cyclicality outside data center"],
    watch: ["Data center revenue", "Custom silicon milestones", "Optical DSP demand", "Guidance acceleration"],
    scores: [5, 3, 3, 4, 5],
    sources: ["marvellQ1", "nasdaq"]
  },
  {
    ticker: "ARM",
    name: "Arm Holdings",
    assetClass: "stocks",
    layer: "CPU architecture and IP",
    risk: "High",
    role: "Energy-efficient CPU IP used across mobile, edge, cloud, and increasingly AI infrastructure.",
    thesis: "Arm is a royalty-style bet on energy-efficient compute spreading from phones to cloud, edge AI, and custom silicon. The valuation often prices in a lot of perfection.",
    bull: ["Massive installed ecosystem", "AI edge and cloud CPU optionality", "Royalty model with high incremental margins"],
    risks: ["Rich valuation", "SoftBank ownership overhang", "RISC-V and custom architecture competition", "Revenue depends on licensing cadence"],
    watch: ["Royalty growth", "Cloud and data center adoption", "License revenue", "Gross margin"],
    scores: [4, 4, 4, 5, 4],
    sources: ["nasdaq"]
  },
  {
    ticker: "ANET",
    name: "Arista Networks",
    assetClass: "stocks",
    layer: "Networking",
    risk: "Medium-High",
    role: "High-speed cloud networking and Ethernet fabrics for AI clusters.",
    thesis: "Arista is one of the best public ways to own AI networking without buying a chipmaker. Ethernet AI fabrics are a key theme as clusters scale.",
    bull: ["Cloud titan customer base", "AI Ethernet fabrics", "Strong margins and execution history"],
    risks: ["Large customer concentration", "Cisco and white-box competition", "AI networking spending can be lumpy", "Inventory digestion risk"],
    watch: ["Cloud revenue", "AI networking wins", "Gross margin", "Customer concentration disclosure"],
    scores: [4, 4, 5, 4, 3],
    sources: ["aristaFY", "nasdaq"]
  },
  {
    ticker: "SMCI",
    name: "Super Micro Computer",
    assetClass: "stocks",
    layer: "Servers and racks",
    risk: "Speculative",
    role: "AI server and rack-scale systems integrator.",
    thesis: "Super Micro offers torque to AI server deployments, especially when speed-to-market matters. The risk is that server integration can become margin-compressed and operationally messy.",
    bull: ["Fast AI server cycle exposure", "Rack-scale system demand", "Close relationships across GPU ecosystems"],
    risks: ["Accounting and governance concerns can dominate fundamentals", "Lower-margin hardware integration", "Inventory and supply risk", "Customer concentration"],
    watch: ["Gross margin", "Cash conversion", "Backlog quality", "Governance disclosures"],
    scores: [5, 2, 2, 3, 5],
    sources: ["nasdaq"]
  },
  {
    ticker: "DELL",
    name: "Dell Technologies",
    assetClass: "stocks",
    layer: "Servers and enterprise infrastructure",
    risk: "Medium-High",
    role: "AI-optimized servers, storage, enterprise systems, and services.",
    thesis: "Dell converts enterprise and cloud AI demand into servers, storage, and services. It is not as high margin as silicon, but AI server scale has become material.",
    bull: ["Record AI server revenue", "Enterprise customer reach", "Storage attach potential"],
    risks: ["Hardware margins can be thin", "PC cycle still matters", "Supply constraints", "Backlog quality and timing"],
    watch: ["AI server revenue", "ISG margins", "Backlog and pipeline", "Cash return"],
    scores: [4, 3, 4, 3, 4],
    sources: ["dellFY", "nasdaq"]
  },
  {
    ticker: "HPE",
    name: "Hewlett Packard Enterprise",
    assetClass: "stocks",
    layer: "Servers and networking",
    risk: "Medium",
    role: "Enterprise servers, supercomputing, networking, and hybrid cloud infrastructure.",
    thesis: "HPE is a steadier, less explosive AI infrastructure name with exposure to enterprise servers, HPC, and networking. Upside depends on execution and mix shift.",
    bull: ["Enterprise and HPC installed base", "Networking expansion", "Hybrid cloud and private AI demand"],
    risks: ["Slower growth than AI pure plays", "Margin pressure", "Integration risk", "Competitive server market"],
    watch: ["Server revenue", "Networking margin", "AI systems orders", "Free cash flow"],
    scores: [3, 3, 3, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "COHR",
    name: "Coherent",
    assetClass: "stocks",
    layer: "Optical components",
    risk: "High",
    role: "Optical materials, lasers, transceivers, and components for AI data center connectivity.",
    thesis: "Coherent is a leveraged way to own optical bandwidth demand. AI clusters need ever-faster links, but this is a cyclical component supplier.",
    bull: ["Optical transceiver demand", "AI cluster bandwidth growth", "Potential operating leverage"],
    risks: ["Cyclical telecom and industrial exposure", "Debt and margin variability", "Customer concentration", "Fast technology transitions"],
    watch: ["Datacom revenue", "Gross margin", "Debt reduction", "800G/1.6T adoption"],
    scores: [4, 3, 2, 3, 5],
    sources: ["nasdaq"]
  },
  {
    ticker: "GLW",
    name: "Corning",
    assetClass: "stocks",
    layer: "Optical fiber and materials",
    risk: "Medium",
    role: "Fiber, glass, and materials used in telecom, cloud, and data center connectivity.",
    thesis: "Corning is a broader materials play on bandwidth and fiber buildout. It is less pure, but AI should increase network density and optical demand.",
    bull: ["Fiber demand from cloud and network upgrades", "Diversified materials portfolio", "Potential operating leverage"],
    risks: ["Consumer electronics and display cycles", "Telecom capex cyclicality", "Lower AI purity", "Margin variability"],
    watch: ["Optical communications revenue", "Pricing", "Free cash flow", "Telecom carrier capex"],
    scores: [3, 3, 3, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "APH",
    name: "Amphenol",
    assetClass: "stocks",
    layer: "Connectors and interconnect",
    risk: "Medium",
    role: "High-performance connectors, cables, and interconnect systems used across data centers and electronics.",
    thesis: "Amphenol is a high-quality compounder with AI data center exposure through high-speed interconnect. It is not a pure play, but its execution record is strong.",
    bull: ["Interconnect density growth", "Diversified end markets", "Strong acquisition and margin track record"],
    risks: ["Premium valuation", "Cyclical electronics demand", "Lower direct AI visibility", "Integration risk from acquisitions"],
    watch: ["IT datacom sales", "Operating margin", "Organic growth", "Acquisition pace"],
    scores: [3, 4, 5, 3, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "MPWR",
    name: "Monolithic Power Systems",
    assetClass: "stocks",
    layer: "Power semiconductors",
    risk: "Medium-High",
    role: "Power management chips for data center, automotive, industrial, and compute systems.",
    thesis: "AI servers create high-density power delivery challenges. Monolithic Power is a quality way to own efficient power conversion inside the box.",
    bull: ["Power density demand", "High margins", "Data center growth optionality"],
    risks: ["Customer concentration", "Valuation", "Semiconductor cyclicality", "Design-win timing"],
    watch: ["Enterprise data revenue", "Gross margin", "Inventory", "Design wins"],
    scores: [4, 4, 5, 4, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "TER",
    name: "Teradyne",
    assetClass: "stocks",
    layer: "Test equipment",
    risk: "Medium-High",
    role: "Semiconductor test equipment for advanced chips, memory, and systems.",
    thesis: "As AI chips become bigger, more complex, and more expensive, test intensity rises. Teradyne provides indirect exposure to quality control and advanced chip ramps.",
    bull: ["AI chip test complexity", "Memory and SoC test demand", "Robotics optionality"],
    risks: ["Customer capex cyclicality", "Apple/mobile exposure", "Competitive test equipment market", "Order timing"],
    watch: ["Semiconductor test revenue", "Memory test demand", "AI accelerator ramps", "Guidance"],
    scores: [3, 3, 4, 3, 4],
    sources: ["nasdaq"]
  },
  {
    ticker: "SNPS",
    name: "Synopsys",
    assetClass: "stocks",
    layer: "Chip design software",
    risk: "Medium",
    role: "Electronic design automation and IP used to design advanced chips.",
    thesis: "AI chip competition increases the value of EDA tools and verification. Synopsys is a picks-and-shovels software name rather than a direct hardware cycle bet.",
    bull: ["EDA software moats", "Custom silicon design growth", "High recurring revenue"],
    risks: ["Premium valuation", "Regulatory risk around acquisitions", "Customer consolidation", "Long sales cycles"],
    watch: ["ARR growth", "Design IP revenue", "Margins", "EDA demand from custom AI silicon"],
    scores: [4, 5, 5, 3, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "CDNS",
    name: "Cadence Design Systems",
    assetClass: "stocks",
    layer: "Chip design software",
    risk: "Medium",
    role: "EDA, simulation, and system design software for chips and electronics.",
    thesis: "Cadence benefits as more companies design custom AI silicon and complex systems. It is a high-quality software-like route into semiconductors.",
    bull: ["Custom silicon design activity", "Sticky EDA workflow", "Systems simulation expansion"],
    risks: ["Premium valuation", "EDA growth can normalize", "Customer concentration in large chipmakers", "Execution on platform expansion"],
    watch: ["Backlog", "Recurring revenue", "Operating margin", "AI design wins"],
    scores: [4, 5, 5, 3, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    assetClass: "stocks",
    layer: "Cloud and AI platform",
    risk: "Medium",
    role: "Azure, enterprise AI, productivity AI, model partnerships, and internal AI infrastructure.",
    thesis: "Microsoft is a core AI infrastructure compounder: it owns enterprise distribution, Azure demand, AI products, and one of the deepest capex programs in the market.",
    bull: ["Azure AI demand", "Enterprise distribution through Microsoft 365", "Strong balance sheet and cash flow"],
    risks: ["AI capex ROI scrutiny", "Cloud capacity constraints", "Regulatory attention", "Dependency on large partner ecosystem"],
    watch: ["Azure growth", "AI services contribution", "Capex and depreciation", "Copilot monetization"],
    scores: [5, 5, 5, 3, 2],
    sources: ["microsoftQ3", "nasdaq"]
  },
  {
    ticker: "GOOGL",
    name: "Alphabet",
    assetClass: "stocks",
    layer: "Cloud and AI platform",
    risk: "Medium",
    role: "Google Cloud, TPUs, search AI, Gemini models, and global data center infrastructure.",
    thesis: "Alphabet is both a buyer and builder of AI infrastructure. Its TPU stack, cloud growth, and search distribution give it multiple ways to benefit.",
    bull: ["Vertical AI stack with TPUs", "Google Cloud growth", "Search and YouTube monetization"],
    risks: ["Search disruption and regulatory cases", "Heavy capex", "Cloud competition", "AI monetization uncertainty"],
    watch: ["Google Cloud revenue and margin", "Capex", "Search growth", "TPU adoption"],
    scores: [5, 5, 5, 2, 2],
    sources: ["alphabetQ1", "nasdaq"]
  },
  {
    ticker: "AMZN",
    name: "Amazon",
    assetClass: "stocks",
    layer: "Cloud and AI platform",
    risk: "Medium",
    role: "AWS cloud infrastructure, Trainium chips, Bedrock, and global logistics/data systems.",
    thesis: "AWS is a central buyer and seller of AI infrastructure. Amazon also has upside from custom silicon and AI integration across retail, ads, and logistics.",
    bull: ["AWS scale", "Trainium and Graviton custom silicon", "Advertising and retail cash generation"],
    risks: ["Capex pressure on free cash flow", "Cloud competition", "Retail cyclicality", "Margin sensitivity"],
    watch: ["AWS growth and operating income", "Capex", "Trainium adoption", "Free cash flow"],
    scores: [5, 5, 5, 2, 3],
    sources: ["amazonQ1", "nasdaq"]
  },
  {
    ticker: "META",
    name: "Meta Platforms",
    assetClass: "stocks",
    layer: "AI application and infrastructure buyer",
    risk: "Medium-High",
    role: "Massive AI infrastructure buyer for recommendation, ads, Llama models, and consumer AI.",
    thesis: "Meta is not a neutral infrastructure vendor, but it is one of the largest and most profitable AI infrastructure buyers. Its AI spend can improve ads and create model/platform optionality.",
    bull: ["Large ad cash engine", "Open model ecosystem via Llama", "Scale benefits from AI ranking and content systems"],
    risks: ["Heavy capex and Reality Labs losses", "Regulatory risk", "Social platform competition", "AI ROI timing"],
    watch: ["Capex guidance", "Ad revenue growth", "AI engagement metrics", "Free cash flow"],
    scores: [4, 4, 5, 3, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "ORCL",
    name: "Oracle",
    assetClass: "stocks",
    layer: "Cloud and AI infrastructure",
    risk: "Medium-High",
    role: "Oracle Cloud Infrastructure, large AI training clusters, databases, and enterprise cloud apps.",
    thesis: "Oracle has become a high-growth AI infrastructure story through large OCI contracts. The opportunity is real, but the funding and capex load are much larger than Oracle investors are used to.",
    bull: ["OCI growth and large AI contracts", "Huge RPO expansion", "Database and enterprise app moat"],
    risks: ["Balance sheet and funding needs", "Customer concentration in large AI contracts", "Capex ROI uncertainty", "Execution risk building data centers"],
    watch: ["Cloud infrastructure revenue", "RPO quality", "Free cash flow", "Debt and equity financing"],
    scores: [5, 4, 4, 4, 4],
    sources: ["oracleFY", "nasdaq"]
  },
  {
    ticker: "IBM",
    name: "IBM",
    assetClass: "stocks",
    layer: "Enterprise AI and hybrid cloud",
    risk: "Medium",
    role: "Hybrid cloud, consulting, enterprise AI, mainframe, and automation.",
    thesis: "IBM is a steadier enterprise AI and hybrid-cloud play. It will not have the same upside as AI pure plays, but it offers cash flow and lower volatility.",
    bull: ["Enterprise customer relationships", "Hybrid cloud and consulting", "Dividend and cash flow profile"],
    risks: ["Slower organic growth", "Consulting cyclicality", "Less direct AI infrastructure leverage", "Execution on software mix"],
    watch: ["Software growth", "Consulting signings", "Free cash flow", "AI bookings"],
    scores: [2, 3, 4, 2, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "CRWV",
    name: "CoreWeave",
    assetClass: "stocks",
    layer: "AI cloud",
    risk: "Speculative",
    role: "GPU cloud and purpose-built AI infrastructure provider.",
    thesis: "CoreWeave is one of the purest public AI cloud infrastructure bets. The growth and backlog are enormous, but leverage, capex, customer concentration, and execution risk are equally large.",
    bull: ["Nearly $100B revenue backlog", "Purpose-built AI cloud", "NVIDIA partnership and GPU access"],
    risks: ["Heavy debt and capital intensity", "Net losses", "Customer concentration", "GPU depreciation and technology refresh risk"],
    watch: ["Revenue backlog conversion", "Power capacity", "Adjusted EBITDA margin", "Debt and interest expense"],
    scores: [5, 3, 2, 4, 5],
    sources: ["coreweaveQ1", "nasdaq"]
  },
  {
    ticker: "EQIX",
    name: "Equinix",
    assetClass: "stocks",
    layer: "Data center real estate",
    risk: "Medium",
    role: "Global interconnection and colocation data center REIT.",
    thesis: "Equinix is a higher-quality, less explosive way to own AI-driven data gravity. It matters for enterprise connectivity, interconnection, and hybrid multicloud architecture.",
    bull: ["Global interconnection moat", "Recurring revenue", "AI and hybrid cloud demand"],
    risks: ["REIT rate sensitivity", "Power availability constraints", "High capex", "Lower direct hyperscale torque than some peers"],
    watch: ["MRR growth", "AFFO", "Utilization", "Development pipeline"],
    scores: [3, 4, 5, 2, 2],
    sources: ["equinixQ1", "nasdaq"]
  },
  {
    ticker: "DLR",
    name: "Digital Realty",
    assetClass: "stocks",
    layer: "Data center real estate",
    risk: "Medium",
    role: "Global data center REIT with hyperscale, colocation, and interconnection exposure.",
    thesis: "Digital Realty gives direct data center capacity exposure, including hyperscale AI-oriented development. It can benefit from leasing demand, but capital intensity is high.",
    bull: ["Record bookings and backlog", "Large global footprint", "AI-oriented hyperscale capacity"],
    risks: ["REIT rate sensitivity", "Development execution", "Power availability", "Debt and equity issuance needs"],
    watch: ["Bookings", "Backlog commencements", "Core FFO", "Development yields and leverage"],
    scores: [4, 3, 4, 2, 3],
    sources: ["digitalRealtyQ1", "nasdaq"]
  },
  {
    ticker: "VRT",
    name: "Vertiv",
    assetClass: "stocks",
    layer: "Power and cooling",
    risk: "High",
    role: "Data center power, thermal, liquid cooling, and infrastructure systems.",
    thesis: "Vertiv is one of the most direct public picks-and-shovels names for AI data center power and cooling. Its key question is how much growth is already in the stock.",
    bull: ["Liquid cooling and power density demand", "AI data center project pipeline", "Operating leverage"],
    risks: ["Valuation and cyclicality", "Competition from electrical and HVAC incumbents", "Execution on large projects", "Supply chain and backlog timing"],
    watch: ["Orders and backlog", "Organic growth", "Liquid cooling mix", "Margins"],
    scores: [5, 4, 4, 4, 4],
    sources: ["vertivQ1", "nasdaq"]
  },
  {
    ticker: "ETN",
    name: "Eaton",
    assetClass: "stocks",
    layer: "Power and grid equipment",
    risk: "Medium",
    role: "Electrical equipment, power distribution, switchgear, and data center electrical systems.",
    thesis: "Eaton is a high-quality way to own electrification and AI data center power distribution. It is less volatile than pure AI hardware but still exposed to the bottleneck.",
    bull: ["Data center electrical demand", "Backlog and pricing", "Broad electrification cycle"],
    risks: ["Premium valuation", "Industrial cycle exposure", "Capacity expansion execution", "Slower utility/project timing"],
    watch: ["Electrical Americas orders", "Backlog", "Segment margins", "Data center order commentary"],
    scores: [4, 4, 5, 3, 2],
    sources: ["eatonQ1", "nasdaq"]
  },
  {
    ticker: "GEV",
    name: "GE Vernova",
    assetClass: "stocks",
    layer: "Power generation and electrification",
    risk: "Medium-High",
    role: "Gas turbines, grid equipment, electrification, and power services.",
    thesis: "GE Vernova benefits from the collision of AI data center load growth and constrained power infrastructure. It is not just AI, but AI has intensified the power shortage story.",
    bull: ["Gas turbine demand and backlog", "Electrification orders for data centers", "Grid modernization"],
    risks: ["Execution after spin-off", "Cyclical energy equipment demand", "Supply bottlenecks", "Valuation after strong run"],
    watch: ["Gas turbine backlog", "Electrification orders", "Service margins", "Free cash flow"],
    scores: [4, 4, 4, 4, 3],
    sources: ["geVernovaQ1", "nasdaq"]
  },
  {
    ticker: "PWR",
    name: "Quanta Services",
    assetClass: "stocks",
    layer: "Grid construction",
    risk: "Medium",
    role: "Engineering and construction for electric grid, renewables, communications, and data center infrastructure.",
    thesis: "Quanta is a construction and services bottleneck bet. AI infrastructure needs substations, transmission, interconnection, and grid hardening, all of which fit Quanta's wheelhouse.",
    bull: ["Grid modernization backlog", "Data center power work", "Multi-year infrastructure demand"],
    risks: ["Labor availability", "Project execution", "Cyclical utility spending", "Weather and permitting delays"],
    watch: ["Backlog", "Margins", "Utility demand", "Large project awards"],
    scores: [3, 3, 4, 3, 3],
    sources: ["quantaQ1", "nasdaq"]
  },
  {
    ticker: "CEG",
    name: "Constellation Energy",
    assetClass: "stocks",
    layer: "Power generation",
    risk: "Medium",
    role: "Largest U.S. nuclear fleet operator and clean firm-power supplier.",
    thesis: "AI data centers need reliable, carbon-free baseload power. Constellation is one of the most direct public beneficiaries of renewed nuclear demand from hyperscalers.",
    bull: ["Nuclear scarcity value", "Long-term power contracts", "Potential data center PPAs"],
    risks: ["Regulatory and political risk", "Power price volatility", "Plant operating risk", "Valuation after nuclear rerating"],
    watch: ["PPA pricing", "Nuclear fleet availability", "Capacity market prices", "Crane Clean Energy Center milestones"],
    scores: [4, 4, 4, 3, 3],
    sources: ["constellationPPA", "nasdaq"]
  },
  {
    ticker: "VST",
    name: "Vistra",
    assetClass: "stocks",
    layer: "Power generation",
    risk: "Medium-High",
    role: "Power generation and retail electricity provider with gas, nuclear, renewables, and storage exposure.",
    thesis: "Vistra is a merchant power and scarcity-value play. Data center load growth can support higher power prices, but earnings can swing with commodity and market conditions.",
    bull: ["Power scarcity in key markets", "Nuclear and gas fleet optionality", "Cash return potential"],
    risks: ["Merchant power price volatility", "Regulation", "Fuel and weather exposure", "Less pure data center linkage"],
    watch: ["Forward power curves", "Capacity prices", "Hedging", "Free cash flow"],
    scores: [3, 3, 4, 3, 4],
    sources: ["nasdaq", "ieaSupply"]
  },
  {
    ticker: "NRG",
    name: "NRG Energy",
    assetClass: "stocks",
    layer: "Power generation and retail",
    risk: "Medium-High",
    role: "Retail electricity and generation exposure in U.S. power markets.",
    thesis: "NRG can benefit from tightening power markets, though it is less directly tied to hyperscale AI data center buildout than Constellation or Vistra.",
    bull: ["Electric load growth", "Retail power customer base", "Cash flow and capital return"],
    risks: ["Power price volatility", "Regulatory interventions", "Retail margin variability", "Lower AI purity"],
    watch: ["Retail margins", "Power market pricing", "Free cash flow", "Capital allocation"],
    scores: [2, 3, 3, 2, 4],
    sources: ["nasdaq", "ieaSupply"]
  },
  {
    ticker: "BE",
    name: "Bloom Energy",
    assetClass: "stocks",
    layer: "On-site power",
    risk: "Speculative",
    role: "Fuel cell systems and on-site power solutions for facilities including data centers.",
    thesis: "Bloom is a speculative power bottleneck play. If grid queues remain painful, on-site generation can matter, but profitability, competition, and project economics are key risks.",
    bull: ["On-site power demand", "Potential data center deployments", "Policy and grid constraints"],
    risks: ["Profitability and cash flow volatility", "Fuel cost and emissions scrutiny", "Competition from turbines, batteries, and grid upgrades", "Project timing risk"],
    watch: ["Data center orders", "Gross margin", "Cash burn", "Backlog conversion"],
    scores: [4, 2, 2, 3, 5],
    sources: ["oracleFY", "nasdaq"]
  },
  {
    ticker: "OKLO",
    name: "Oklo",
    assetClass: "stocks",
    layer: "Advanced nuclear",
    risk: "Speculative",
    role: "Advanced nuclear developer targeting small, modular, firm power.",
    thesis: "Oklo is a very early-stage nuclear option on future data center power demand. It is not a near-term cash-flow infrastructure holding.",
    bull: ["Huge long-term firm power demand", "Potential hyperscaler interest in nuclear", "Scarcity of clean baseload options"],
    risks: ["Regulatory approval risk", "No mature operating fleet", "Financing and dilution risk", "Long timelines"],
    watch: ["NRC milestones", "Power purchase agreements", "Project financing", "Cash runway"],
    scores: [3, 2, 1, 4, 5],
    sources: ["nasdaq", "ieaSupply"]
  },
  {
    ticker: "SMR",
    name: "NuScale Power",
    assetClass: "stocks",
    layer: "Advanced nuclear",
    risk: "Speculative",
    role: "Small modular reactor technology developer.",
    thesis: "NuScale is another speculative nuclear path. The AI power story gives it narrative fuel, but commercialization timing and financing remain the central issues.",
    bull: ["SMR interest from utilities and data centers", "Clean firm power theme", "Technology licensing optionality"],
    risks: ["Project cancellations and delays", "Financing needs", "Regulatory and cost risk", "Very high volatility"],
    watch: ["Customer commitments", "NRC updates", "Project cost estimates", "Cash runway"],
    scores: [3, 2, 1, 4, 5],
    sources: ["nasdaq", "ieaSupply"]
  },
  {
    ticker: "IREN",
    name: "IREN",
    assetClass: "stocks",
    layer: "AI data center and compute",
    risk: "Speculative",
    role: "Data center operator pivoting from Bitcoin mining toward AI cloud and high-performance computing.",
    thesis: "IREN is a high-volatility way to own power-accessible compute sites. The upside depends on converting power and sites into durable AI/HPC economics.",
    bull: ["Power access and data center sites", "AI/HPC pivot optionality", "High torque to compute demand"],
    risks: ["Crypto exposure and volatility", "Execution risk in AI transition", "Financing needs", "Commodity-like compute pricing"],
    watch: ["AI cloud contracts", "Power capacity", "Capex funding", "Bitcoin exposure"],
    scores: [4, 2, 1, 3, 5],
    sources: ["nasdaq"]
  },
  {
    ticker: "CORZ",
    name: "Core Scientific",
    assetClass: "stocks",
    layer: "AI data center and compute",
    risk: "Speculative",
    role: "Digital infrastructure operator with Bitcoin mining roots and AI/HPC hosting ambitions.",
    thesis: "Core Scientific is a speculative conversion story: power and sites that once served mining may become AI hosting capacity. Contract quality is everything.",
    bull: ["Large power footprint", "Potential AI/HPC hosting contracts", "Operating leverage"],
    risks: ["Post-restructuring history", "Crypto sensitivity", "Customer and contract risk", "Financing and dilution"],
    watch: ["HPC contracted capacity", "Mining economics", "Debt and cash", "Power costs"],
    scores: [4, 2, 1, 3, 5],
    sources: ["nasdaq"]
  },
  {
    ticker: "WULF",
    name: "TeraWulf",
    assetClass: "stocks",
    layer: "AI data center and compute",
    risk: "Speculative",
    role: "Power-backed digital infrastructure company with Bitcoin mining and HPC optionality.",
    thesis: "TeraWulf is a power-access option on AI hosting, but it is still a speculative digital infrastructure name where financing and contract execution dominate.",
    bull: ["Power assets and sites", "Potential HPC conversion", "High upside if contracts land"],
    risks: ["Crypto cycle exposure", "Dilution and financing", "Project execution", "Customer concentration"],
    watch: ["HPC deals", "Power costs", "Hash economics", "Balance sheet"],
    scores: [3, 2, 1, 3, 5],
    sources: ["nasdaq"]
  },
  {
    ticker: "QCOM",
    name: "Qualcomm",
    assetClass: "stocks",
    layer: "Edge AI and connectivity",
    risk: "Medium",
    role: "Mobile, edge AI, automotive, IoT, and connectivity silicon.",
    thesis: "Qualcomm is more edge AI than data center. It belongs in the universe because on-device AI and connectivity are part of the broader AI infrastructure stack.",
    bull: ["Edge AI chips", "Automotive and IoT growth", "Strong IP and licensing"],
    risks: ["Smartphone cycle", "Apple modem transition", "Data center AI exposure is limited", "China handset exposure"],
    watch: ["Handset recovery", "Automotive backlog", "AI PC/edge wins", "Licensing stability"],
    scores: [3, 4, 4, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "FLEX",
    name: "Flex",
    assetClass: "stocks",
    layer: "Manufacturing services",
    risk: "Medium",
    role: "Contract manufacturing and supply-chain services for electronics and data center equipment.",
    thesis: "Flex provides quieter picks-and-shovels exposure to hardware manufacturing and supply-chain complexity. It is not a pure AI name, but AI infrastructure needs manufacturing scale.",
    bull: ["Data center manufacturing demand", "Diversified customer base", "Operational leverage"],
    risks: ["Low-margin manufacturing", "Customer concentration", "Macro and inventory cycles", "Lower AI purity"],
    watch: ["Data center program growth", "Margins", "Cash conversion", "Customer mix"],
    scores: [2, 2, 3, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "SMH",
    name: "VanEck Semiconductor ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium-High",
    role: "Concentrated semiconductor ETF for AI compute, foundry, and equipment exposure.",
    thesis: "SMH is the simplest one-ticket way to own the semiconductor side of AI infrastructure. It reduces single-name risk, but it is still chip-cycle concentrated.",
    bull: ["Broad semiconductor exposure", "Owns many AI leaders", "Easy rebalancing through ETF structure"],
    risks: ["Semiconductor cycle risk", "Concentration in mega-cap names", "Expense ratio", "May underperform best single names"],
    watch: ["Top holdings concentration", "Semiconductor index momentum", "Expense ratio", "Drawdowns"],
    scores: [5, 3, 4, 3, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "SOXX",
    name: "iShares Semiconductor ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium-High",
    role: "Semiconductor ETF with diversified exposure across chipmakers and equipment.",
    thesis: "SOXX is a disciplined way to own the chip supply chain without picking the exact winners. It complements or substitutes for SMH.",
    bull: ["Diversified chip exposure", "Covers equipment and designers", "Reduces company-specific risk"],
    risks: ["Still cyclical", "Index construction may lag AI leaders", "Expense ratio", "High correlation with SMH"],
    watch: ["Index holdings", "Sector drawdowns", "Expense ratio", "Overlap with direct holdings"],
    scores: [5, 3, 4, 3, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "AIQ",
    name: "Global X Artificial Intelligence & Technology ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium",
    role: "Broad AI and technology ETF including infrastructure and application companies.",
    thesis: "AIQ spreads the AI bet beyond chips into software, platforms, and services. It is less precise for infrastructure, but useful for breadth.",
    bull: ["Broad AI theme exposure", "Less chip-specific than SMH", "Captures application winners"],
    risks: ["May hold less infrastructure than desired", "Thematic ETF fees", "Overlap with mega-cap tech", "Theme drift"],
    watch: ["Holdings", "Expense ratio", "Mega-cap concentration", "Overlap with XLK/IYW"],
    scores: [4, 2, 4, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "BOTZ",
    name: "Global X Robotics & Artificial Intelligence ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium-High",
    role: "Robotics and AI thematic ETF with hardware, automation, and AI-related holdings.",
    thesis: "BOTZ is more robotics and automation than core AI infrastructure. It works as a satellite position if you want physical AI exposure.",
    bull: ["Robotics and automation exposure", "Some AI hardware overlap", "Global thematic basket"],
    risks: ["Theme mismatch for AI infrastructure", "Expense ratio", "Global holdings/currency exposure", "Can lag chip-focused ETFs"],
    watch: ["Holdings", "Japan exposure", "Robotics demand", "Expense ratio"],
    scores: [3, 2, 3, 2, 3],
    sources: ["nasdaq"]
  },
  {
    ticker: "GRID",
    name: "First Trust NASDAQ Clean Edge Smart Grid Infrastructure ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium",
    role: "Smart grid and electrical infrastructure ETF.",
    thesis: "GRID is the ETF expression of the power bottleneck. It is not an AI ETF, but AI demand makes grid equipment, transmission, and electrification more relevant.",
    bull: ["Grid modernization exposure", "Power infrastructure breadth", "Diversifies away from chips"],
    risks: ["Not a pure AI fund", "Utility and industrial cyclicality", "Expense ratio", "May miss best individual power names"],
    watch: ["Top holdings", "Utility capex trends", "Electrical equipment margins", "Expense ratio"],
    scores: [3, 3, 4, 2, 2],
    sources: ["nasdaq", "ieaSupply"]
  },
  {
    ticker: "IYW",
    name: "iShares U.S. Technology ETF",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium",
    role: "Broad U.S. technology ETF with large AI platform and chip exposure.",
    thesis: "IYW is a broad tech core for AI-adjacent compounding. It lowers single-theme risk versus a pure chip basket.",
    bull: ["Mega-cap AI platform exposure", "Diversified U.S. tech", "Lower maintenance"],
    risks: ["Mega-cap concentration", "Less targeted power and infrastructure exposure", "Sector valuation", "Overlap with direct stocks"],
    watch: ["Top holdings", "Expense ratio", "Tech sector valuation", "Overlap"],
    scores: [4, 3, 5, 2, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "XLK",
    name: "Technology Select Sector SPDR Fund",
    assetClass: "etf",
    layer: "ETF basket",
    risk: "Medium",
    role: "Large-cap U.S. technology sector ETF.",
    thesis: "XLK is a simple large-cap technology anchor. It is less specific than SMH, but it can stabilize portfolios built around AI infrastructure names.",
    bull: ["Liquid low-cost sector exposure", "Owns major AI platform companies", "Useful core holding"],
    risks: ["Sector concentration", "Not specific to power or data centers", "May underweight some AI infrastructure leaders", "Valuation sensitivity"],
    watch: ["Top holdings", "Expense ratio", "Sector concentration", "Overlap"],
    scores: [4, 3, 5, 2, 2],
    sources: ["nasdaq"]
  },
  {
    ticker: "SGOV",
    name: "iShares 0-3 Month Treasury Bond ETF",
    assetClass: "etf",
    layer: "Cash buffer",
    risk: "Low",
    role: "Treasury-bill ETF used as dry powder and volatility buffer.",
    thesis: "SGOV is not an AI investment. It is included for portfolio construction: cash-like reserves reduce regret if high-growth AI names correct sharply.",
    bull: ["Low duration", "Dry powder", "Income while waiting"],
    risks: ["Not an AI upside vehicle", "Yield can fall", "Small price movements around distributions", "Opportunity cost in bull markets"],
    watch: ["T-bill yields", "Expense ratio", "Distribution yield", "Portfolio cash needs"],
    scores: [1, 2, 4, 1, 1],
    sources: ["nasdaq"]
  }
];

const PORTFOLIOS = [
  {
    id: "balanced",
    name: "6-12M Tactical Balanced",
    objective: "Own the full AI infrastructure stack while keeping a small cash-like buffer for volatility.",
    risk: "Medium-High",
    horizon: "6-12 months",
    useCase: "Best default for a one-year AI infrastructure trade without making one huge bet on a single layer.",
    weights: {
      NVDA: 12, AVGO: 10, TSM: 8, ASML: 5, AMD: 5, MU: 6, MRVL: 4, ANET: 5,
      VRT: 7, ETN: 6, GEV: 5, CEG: 5, MSFT: 5, AMZN: 4, GOOGL: 3, ORCL: 3, EQIX: 2, SGOV: 5
    }
  },
  {
    id: "etf_foundation",
    name: "6-12M ETF Core",
    objective: "Use ETFs for most exposure, then add a few current-cycle power and semiconductor satellites.",
    risk: "Medium",
    horizon: "6-12 months",
    useCase: "Good if you want the theme with less single-company risk over the next few quarters.",
    weights: { SMH: 28, GRID: 14, AIQ: 12, XLK: 10, SGOV: 12, ETN: 6, VRT: 6, CEG: 5, EQIX: 4, AVGO: 3 }
  },
  {
    id: "semicap",
    name: "6-12M Semiconductor Momentum",
    objective: "Concentrate on the liquid chip, foundry, memory, equipment, and AI networking names most tied to near-term capex.",
    risk: "High",
    horizon: "6-12 months",
    useCase: "For maximum exposure to the semiconductor earnings and backlog cycle over the next year.",
    weights: { NVDA: 18, AVGO: 14, TSM: 10, ASML: 8, AMAT: 7, LRCX: 6, KLAC: 6, MU: 9, AMD: 7, MRVL: 5, ANET: 4, SMH: 4, SGOV: 2 }
  },
  {
    id: "cloud_factories",
    name: "6-12M Cloud And AI Factories",
    objective: "Own the cloud platforms and AI infrastructure buyers/sellers most exposed to this capex wave.",
    risk: "Medium-High",
    horizon: "6-12 months",
    useCase: "If you think the next year rewards the companies monetizing AI demand and building the largest AI factories.",
    weights: { MSFT: 14, AMZN: 13, GOOGL: 11, META: 9, ORCL: 10, CRWV: 5, NVDA: 9, AVGO: 6, ANET: 4, DELL: 4, VRT: 4, SGOV: 7, EQIX: 2, DLR: 2 }
  },
  {
    id: "power_grid",
    name: "6-12M Power Bottleneck",
    objective: "Target the immediate AI constraints: cooling, switchgear, grid work, power generation, and data center capacity.",
    risk: "Medium-High",
    horizon: "6-12 months",
    useCase: "If you think the next few quarters reward the companies relieving power and cooling constraints.",
    weights: { VRT: 14, ETN: 14, GEV: 13, PWR: 10, CEG: 9, VST: 7, GRID: 10, EQIX: 5, DLR: 4, NRG: 3, BE: 2, SGOV: 7, NVDA: 2 }
  },
  {
    id: "aggressive_compute",
    name: "6-12M Aggressive Compute",
    objective: "Tilt hard toward AI accelerators, custom silicon, memory, networking, servers, and AI cloud torque.",
    risk: "High",
    horizon: "6-12 months",
    useCase: "For a higher-upside, higher-drawdown trade on the current AI compute cycle.",
    weights: { NVDA: 22, AVGO: 15, AMD: 10, TSM: 10, ASML: 7, MU: 9, MRVL: 6, ANET: 5, ARM: 4, CRWV: 4, SMCI: 3, COHR: 2, SGOV: 3 }
  },
  {
    id: "speculative_torque",
    name: "6-12M Speculative Satellite",
    objective: "Own volatile AI cloud, power-backed compute, server, optics, and advanced power names as a tactical satellite.",
    risk: "Speculative",
    horizon: "6-12 months",
    useCase: "Satellite only. Use this when you accept extreme drawdowns and want cash ready for entries.",
    weights: { CRWV: 16, IREN: 10, CORZ: 8, WULF: 6, SMCI: 10, MRVL: 8, COHR: 7, BE: 5, OKLO: 5, SMR: 3, ARM: 6, DELL: 6, SGOV: 10 }
  },
  {
    id: "dca_diversified",
    name: "6-12M Phased DCA",
    objective: "Keep dry powder and phase into AI infrastructure over the next 6-12 months.",
    risk: "Medium",
    horizon: "6-12 months",
    useCase: "For buying in tranches instead of putting the whole $10,000 to work today.",
    weights: { SGOV: 25, SMH: 20, GRID: 10, AIQ: 10, XLK: 8, NVDA: 7, AVGO: 5, TSM: 5, VRT: 4, ETN: 3, CEG: 3 }
  },
  {
    id: "quality_cash",
    name: "6-12M Quality Plus Cash",
    objective: "Hold high-quality AI platforms and chip exposure with a larger cash-like buffer.",
    risk: "Medium",
    horizon: "6-12 months",
    useCase: "If you want near-term AI exposure but care most about keeping optionality for pullbacks.",
    weights: { SGOV: 20, SMH: 20, XLK: 15, MSFT: 10, GOOGL: 8, AMZN: 7, NVDA: 7, TSM: 5, ETN: 4, CEG: 4 }
  }
];

const LAYER_COLORS = {
  "Compute silicon": "#2f7dd1",
  "Custom silicon and networking": "#4371b8",
  "Foundry and packaging": "#6554a6",
  "Semiconductor equipment": "#8b5a2b",
  "Memory and storage": "#b45f45",
  "Networking": "#007a7a",
  "Networking and custom silicon": "#007a7a",
  "Servers and racks": "#587336",
  "Servers and enterprise infrastructure": "#587336",
  "Optical components": "#c77f00",
  "Optical fiber and materials": "#c77f00",
  "Connectors and interconnect": "#c77f00",
  "Power semiconductors": "#b15e2e",
  "Test equipment": "#8f6f00",
  "Chip design software": "#3f6f94",
  "Cloud and AI platform": "#1f6f54",
  "AI application and infrastructure buyer": "#4a7c42",
  "Cloud and AI infrastructure": "#1f6f54",
  "AI cloud": "#1f6f54",
  "Data center real estate": "#6a6a6a",
  "Power and cooling": "#c24b35",
  "Power and grid equipment": "#c24b35",
  "Power generation and electrification": "#a73d2f",
  "Grid construction": "#a73d2f",
  "Power generation": "#a73d2f",
  "Power generation and retail": "#a73d2f",
  "On-site power": "#a73d2f",
  "Advanced nuclear": "#7d6423",
  "AI data center and compute": "#365c83",
  "Edge AI and connectivity": "#3f6f94",
  "Manufacturing services": "#587336",
  "ETF basket": "#444444",
  "Cash buffer": "#747474"
};

const EXECUTIVE_NOTES = [
  "Every model here is now built for a 6-12 month tactical window, not a buy-and-forget decade portfolio. Revisit after each major earnings cycle or if AI capex guidance changes.",
  "The near-term thesis is still full-stack: accelerators, custom silicon, memory, networking, data center shells, cooling, switchgear, power generation, and grid interconnection all matter.",
  "Shorter time horizons deserve more dry powder. SGOV is included in several models as a cash-like volatility buffer and a way to buy pullbacks instead of chasing every move.",
  "This is educational research, not personalized financial advice. Prices move, quotes can lag, and taxes, your risk tolerance, existing holdings, and liquidity needs are not known here."
];

async function fetchNasdaq(symbol, assetClass) {
  const headers = {
    "Accept": "application/json, text/plain, */*",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
    "Origin": "https://www.nasdaq.com",
    "Referer": "https://www.nasdaq.com/"
  };

  async function get(path) {
    const response = await fetch(`https://api.nasdaq.com/api/${path}`, { headers });
    if (!response.ok) throw new Error(`${symbol} ${path} ${response.status}`);
    return response.json();
  }

  const out = { error: "" };
  try {
    const info = await get(`quote/${symbol}/info?assetclass=${assetClass}`);
    out.info = info.data ?? {};
  } catch (error) {
    out.error += `info: ${error.message}; `;
  }
  try {
    const summary = await get(`quote/${symbol}/summary?assetclass=${assetClass}`);
    out.summary = summary.data?.summaryData ?? {};
  } catch (error) {
    out.error += `summary: ${error.message}; `;
  }
  if (assetClass === "stocks") {
    try {
      const profile = await get(`company/${symbol}/company-profile`);
      out.profile = profile.data ?? {};
    } catch (error) {
      out.error += `profile: ${error.message}; `;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 40));
  return out;
}

function parseNumber(value) {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[$,%]/g, "").replace(/,/g, "").trim();
  if (!cleaned || cleaned === "N/A") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function normalizeMarketData(raw, security) {
  const primary = raw.info?.primaryData ?? {};
  const summary = raw.summary ?? {};
  const profile = raw.profile ?? {};
  const lastSale = parseNumber(primary.lastSalePrice ?? summary.LastSalePrice?.value);
  return {
    ticker: security.ticker,
    quoteName: raw.info?.companyName ?? security.name,
    exchange: raw.info?.exchange ?? summary.Exchange?.value ?? "",
    lastSale,
    lastSaleText: primary.lastSalePrice ?? "",
    netChange: primary.netChange ?? "",
    pctChange: primary.percentageChange ?? "",
    direction: primary.deltaIndicator ?? "",
    bid: primary.bidPrice ?? "",
    ask: primary.askPrice ?? "",
    volume: primary.volume ?? summary.ShareVolume?.value ?? "",
    lastTradeTimestamp: primary.lastTradeTimestamp ?? "",
    isRealTime: primary.isRealTime ?? false,
    marketCap: summary.MarketCap?.value ?? "",
    pe: summary.PERatio?.value ?? summary.PEGRatio?.value ?? "",
    oneYearTarget: summary.OneYrTarget?.value ?? "",
    todayHighLow: summary.TodayHighLow?.value ?? "",
    fiftyTwoWeekHighLow: summary.FiftTwoWeekHighLow?.value ?? "",
    averageVolume: summary.AverageVolume?.value ?? "",
    annualizedDividend: summary.AnnualizedDividend?.value ?? "",
    exDividendDate: summary.ExDividendDate?.value ?? "",
    sector: summary.Sector?.value ?? profile.Sector?.value ?? "",
    industry: summary.Industry?.value ?? profile.Industry?.value ?? "",
    description: profile.CompanyDescription?.value ?? "",
    companyUrl: profile.CompanyUrl?.value ?? "",
    error: raw.error.trim()
  };
}

function htmlEscape(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsStringify(value) {
  return JSON.stringify(value).replaceAll("</script", "<\\/script");
}

function buildHtml(data) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>AI Infrastructure 6-12 Month Portfolio Lab</title>
  <style>
    :root {
      --bg: #f7f7f4;
      --ink: #1e2329;
      --muted: #5d6670;
      --line: #d8d8d0;
      --panel: #ffffff;
      --panel2: #eeeeea;
      --accent: #0a7b76;
      --accent2: #b45f45;
      --accent3: #2f7dd1;
      --good: #197b45;
      --bad: #b23b32;
      --warn: #946400;
      --shadow: 0 12px 28px rgba(20, 23, 25, 0.09);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--ink);
      background: var(--bg);
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); }
    button, input, select { font: inherit; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .shell { max-width: 1480px; margin: 0 auto; padding: 24px; }
    .topbar {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
      gap: 20px;
      align-items: stretch;
      padding: 20px 0 12px;
    }
    .titleblock h1 { margin: 0; font-size: clamp(28px, 4vw, 54px); line-height: 1; letter-spacing: 0; }
    .titleblock p { max-width: 900px; margin: 14px 0 0; color: var(--muted); font-size: 16px; line-height: 1.55; }
    .control-strip {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
      padding: 14px;
      display: grid;
      gap: 12px;
      align-content: start;
    }
    .capital-row { display: grid; grid-template-columns: 1fr 150px; gap: 10px; align-items: end; }
    .field label { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
    .field input, .field select {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px 11px;
      background: #fff;
      color: var(--ink);
    }
    .asof { color: var(--muted); font-size: 12px; line-height: 1.45; }
    .tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 12px 0;
      max-width: 100%;
    }
    .tab {
      flex: 0 0 150px;
      min-height: 62px;
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      text-align: left;
      transition: transform 120ms ease, border 120ms ease, background 120ms ease;
    }
    .tab:hover { transform: translateY(-1px); border-color: #a9aca5; }
    .tab.active { border-color: var(--accent); background: #e8f3f1; }
    .tab b { display: block; font-size: 13px; line-height: 1.2; }
    .tab span { display: block; font-size: 11px; color: var(--muted); margin-top: 5px; }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
      gap: 18px;
      align-items: start;
    }
    .grid > * { min-width: 0; }
    .section {
      min-width: 0;
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      border-bottom: 1px solid var(--line);
      padding: 16px;
      background: #fbfbf8;
    }
    .section-header h2 { margin: 0; font-size: 18px; letter-spacing: 0; }
    .section-header p { margin: 6px 0 0; color: var(--muted); font-size: 13px; line-height: 1.45; }
    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      padding: 3px 8px;
      border-radius: 999px;
      border: 1px solid var(--line);
      background: var(--panel2);
      color: var(--muted);
      font-size: 12px;
      white-space: nowrap;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border-bottom: 1px solid var(--line);
      background: var(--panel);
    }
    .metric { padding: 14px 16px; border-right: 1px solid var(--line); min-height: 84px; }
    .metric:last-child { border-right: 0; }
    .metric span { display: block; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.07em; }
    .metric b { display: block; margin-top: 7px; font-size: 21px; }
    .metric small { display: block; margin-top: 5px; color: var(--muted); line-height: 1.35; }
    .band { padding: 16px; border-bottom: 1px solid var(--line); }
    .band:last-child { border-bottom: 0; }
    .stack-map {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 8px;
    }
    .stack-cell {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      min-height: 95px;
      background: #fbfbf8;
    }
    .stack-cell b { display: block; font-size: 13px; margin-bottom: 8px; }
    .stack-cell span { display: inline-block; font-size: 11px; color: var(--muted); margin: 0 6px 6px 0; }
    .bars { display: grid; gap: 8px; }
    .bar-row { display: grid; grid-template-columns: 176px 1fr 54px; gap: 10px; align-items: center; font-size: 12px; }
    .bar-track { background: #e5e5df; height: 10px; border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 999px; background: var(--accent); }
    .table-wrap { overflow-x: auto; max-width: 100%; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table-wrap table { min-width: 760px; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }
    th { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; background: #fbfbf8; position: sticky; top: 0; z-index: 1; }
    td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
    tr.clickable { cursor: pointer; }
    tr.clickable:hover { background: #eef5f4; }
    tr.selected { background: #e8f3f1; }
    .ticker {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-weight: 750;
      color: var(--ink);
    }
    .dot { width: 10px; height: 10px; border-radius: 3px; display: inline-block; background: var(--accent3); flex: 0 0 auto; }
    .change-up { color: var(--good); font-weight: 700; }
    .change-down { color: var(--bad); font-weight: 700; }
    .muted { color: var(--muted); }
    .detail {
      position: sticky;
      top: 14px;
      max-height: calc(100vh - 28px);
      overflow: auto;
    }
    .detail-main { padding: 16px; }
    .detail-title { display: flex; justify-content: space-between; gap: 12px; align-items: start; }
    .detail-title h2 { margin: 0; font-size: 24px; letter-spacing: 0; }
    .detail-title .price { text-align: right; font-variant-numeric: tabular-nums; }
    .price b { display: block; font-size: 22px; }
    .quote-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
    .quote-box {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 10px;
      background: #fbfbf8;
      min-height: 64px;
    }
    .quote-box span { color: var(--muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; display: block; }
    .quote-box b { display: block; margin-top: 5px; overflow-wrap: anywhere; }
    .research-block { padding: 16px; border-top: 1px solid var(--line); }
    .research-block h3 { margin: 0 0 9px; font-size: 14px; letter-spacing: 0; }
    .research-block p { margin: 0; color: var(--ink); line-height: 1.5; font-size: 14px; }
    .research-block ul { margin: 0; padding-left: 18px; color: var(--ink); }
    .research-block li { margin: 7px 0; line-height: 1.38; }
    .scores { display: grid; gap: 8px; }
    .score-row { display: grid; grid-template-columns: 142px 1fr 28px; align-items: center; gap: 8px; font-size: 12px; }
    .score-track { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3px; }
    .score-track i { display: block; height: 8px; border-radius: 2px; background: #dddcd6; }
    .score-track i.on { background: var(--accent); }
    .universe-controls {
      display: grid;
      grid-template-columns: minmax(180px, 1fr) 180px 180px;
      gap: 10px;
      padding: 16px;
      border-bottom: 1px solid var(--line);
    }
    .cards {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      padding: 16px;
    }
    .security-card {
      min-height: 156px;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fbfbf8;
      cursor: pointer;
      display: grid;
      gap: 8px;
      align-content: start;
    }
    .security-card:hover { border-color: var(--accent); background: #eef5f4; }
    .security-card.selected { border-color: var(--accent); background: #e8f3f1; }
    .security-card h3 { margin: 0; font-size: 15px; display: flex; align-items: center; gap: 8px; }
    .security-card p { margin: 0; color: var(--muted); font-size: 12px; line-height: 1.38; }
    .card-row { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; }
    .source-list { display: grid; gap: 10px; padding: 16px; }
    .source-item { border-bottom: 1px solid var(--line); padding-bottom: 10px; }
    .source-item:last-child { border-bottom: 0; padding-bottom: 0; }
    .source-item b { display: block; font-size: 13px; }
    .source-item p { margin: 5px 0 0; color: var(--muted); font-size: 12px; line-height: 1.4; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    .icon-btn, .text-btn {
      border: 1px solid var(--line);
      background: #fff;
      border-radius: 6px;
      min-height: 36px;
      padding: 8px 10px;
      cursor: pointer;
      color: var(--ink);
    }
    .icon-btn { width: 38px; padding: 0; display: inline-grid; place-items: center; }
    .text-btn:hover, .icon-btn:hover { border-color: var(--accent); background: #eef5f4; }
    .note-list { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .note {
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 12px;
      background: #fbfbf8;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.45;
    }
    .footer-space { height: 24px; }
    @media (max-width: 1180px) {
      .grid, .topbar { grid-template-columns: 1fr; }
      .detail { position: static; max-height: none; }
      .cards { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .stack-map { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .note-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 760px) {
      .shell { padding: 14px; }
      .tab { flex-basis: 138px; }
      .capital-row, .universe-controls { grid-template-columns: 1fr; }
      .cards { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: 1fr; }
      .metric { border-right: 0; border-bottom: 1px solid var(--line); }
      .metric:last-child { border-bottom: 0; }
      .stack-map { grid-template-columns: 1fr; }
      .bar-row { grid-template-columns: 120px 1fr 44px; }
      .quote-grid { grid-template-columns: 1fr; }
      .note-list { grid-template-columns: 1fr; }
      th, td { padding: 9px; }
    }
  </style>
</head>
<body>
  <div class="shell">
    <section class="topbar">
      <div class="titleblock">
        <h1>AI Infrastructure 6-12 Month Portfolio Lab</h1>
        <p>Tactical $10,000 model portfolios for the next 6-12 months across the companies and funds building, housing, cooling, networking, and powering AI. Click any stock or ETF to open the research pane with quote data, thesis, risks, watch items, and sources.</p>
      </div>
      <aside class="control-strip">
        <div class="capital-row">
          <div class="field">
            <label for="capitalInput">Capital</label>
            <input id="capitalInput" type="number" min="100" step="100" value="10000">
          </div>
          <div class="field">
            <label for="shareMode">Shares</label>
            <select id="shareMode">
              <option value="fractional">Fractional</option>
              <option value="whole">Whole shares</option>
            </select>
          </div>
        </div>
        <div class="actions">
          <button class="text-btn" id="copyCsvBtn" type="button">Export CSV</button>
          <button class="text-btn" id="resetBtn" type="button">Reset $10,000</button>
        </div>
        <div class="asof">
          Built ${htmlEscape(data.generatedAt)}. Quotes are from Nasdaq API responses and show their own trade timestamps in the stock pane. Verify with your broker before placing orders.
        </div>
      </aside>
    </section>

    <nav class="tabs" id="portfolioTabs"></nav>

    <section class="section" style="margin-bottom: 18px;">
      <div class="band">
        <div class="note-list">
          ${EXECUTIVE_NOTES.map((note) => `<div class="note">${htmlEscape(note)}</div>`).join("")}
        </div>
      </div>
    </section>

    <main class="grid">
      <div>
        <section class="section" id="portfolioSection">
          <div class="section-header">
            <div>
              <h2 id="portfolioName"></h2>
              <p id="portfolioObjective"></p>
            </div>
            <span class="pill" id="portfolioRisk"></span>
          </div>
          <div class="summary-grid" id="portfolioMetrics"></div>
          <div class="band">
            <h2 style="font-size: 15px; margin: 0 0 10px;">Layer Exposure</h2>
            <div class="bars" id="layerBars"></div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Holding</th>
                  <th>Layer</th>
                  <th class="num">Weight</th>
                  <th class="num">Dollars</th>
                  <th class="num">Last</th>
                  <th class="num">Shares</th>
                  <th class="num">Whole Cash</th>
                </tr>
              </thead>
              <tbody id="holdingsBody"></tbody>
            </table>
          </div>
        </section>

        <section class="section" style="margin-top: 18px;">
          <div class="section-header">
            <div>
              <h2>Infrastructure Map</h2>
              <p>How the investable stack connects from model demand to electrons.</p>
            </div>
          </div>
          <div class="band">
            <div class="stack-map" id="stackMap"></div>
          </div>
        </section>

        <section class="section" style="margin-top: 18px;">
          <div class="section-header">
            <div>
              <h2>Clickable Stock And ETF Universe</h2>
              <p>Filter the universe, compare live quote fields, and open any research pane.</p>
            </div>
          </div>
          <div class="universe-controls">
            <div class="field">
              <label for="searchInput">Search</label>
              <input id="searchInput" type="search" placeholder="Ticker, company, layer, thesis">
            </div>
            <div class="field">
              <label for="layerFilter">Layer</label>
              <select id="layerFilter"></select>
            </div>
            <div class="field">
              <label for="riskFilter">Risk</label>
              <select id="riskFilter">
                <option value="">All risk levels</option>
                <option>Low</option>
                <option>Medium</option>
                <option>Medium-High</option>
                <option>High</option>
                <option>Speculative</option>
              </select>
            </div>
          </div>
          <div class="cards" id="securityCards"></div>
        </section>

        <section class="section" style="margin-top: 18px;">
          <div class="section-header">
            <div>
              <h2>Source Notebook</h2>
              <p>Primary sources and live data endpoints used for this dashboard.</p>
            </div>
          </div>
          <div class="source-list">
            ${Object.values(SOURCES).map((source) => `
              <div class="source-item">
                <b><a href="${htmlEscape(source.url)}" target="_blank" rel="noreferrer">${htmlEscape(source.label)}</a></b>
                <p>${htmlEscape(source.note)}</p>
              </div>`).join("")}
          </div>
        </section>
      </div>

      <aside class="section detail" id="detailPane"></aside>
    </main>
    <div class="footer-space"></div>
  </div>
  <script>
    const SECURITIES = ${jsStringify(data.securities)};
    const PORTFOLIOS = ${jsStringify(PORTFOLIOS)};
    const SOURCES = ${jsStringify(SOURCES)};
    const MARKET = ${jsStringify(data.market)};
    const LAYER_COLORS = ${jsStringify(LAYER_COLORS)};
    const STACK = [
      { title: "Model Demand", names: ["MSFT", "GOOGL", "AMZN", "META", "ORCL", "CRWV"] },
      { title: "Accelerators", names: ["NVDA", "AMD", "AVGO", "ARM", "MU", "MPWR"] },
      { title: "Manufacturing", names: ["TSM", "ASML", "AMAT", "LRCX", "KLAC", "TER"] },
      { title: "Networking", names: ["ANET", "MRVL", "COHR", "APH", "GLW"] },
      { title: "Facilities", names: ["VRT", "DELL", "SMCI", "EQIX", "DLR", "HPE"] },
      { title: "Power", names: ["ETN", "GEV", "PWR", "CEG", "VST", "NRG"] }
    ];
    const scoreLabels = ["AI Exposure", "Moat", "Quality", "Valuation Risk", "Volatility"];
    let activePortfolio = PORTFOLIOS[0].id;
    let selectedTicker = "NVDA";

    const byTicker = Object.fromEntries(SECURITIES.map((s) => [s.ticker, s]));

    function money(n) {
      if (n === null || n === undefined || Number.isNaN(Number(n))) return "N/A";
      return Number(n).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: n >= 1000 ? 0 : 2 });
    }
    function pct(n) {
      return Number(n).toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%";
    }
    function shares(n) {
      if (n === null || n === undefined || !Number.isFinite(n)) return "N/A";
      return Number(n).toLocaleString(undefined, { maximumFractionDigits: 4 });
    }
    function rawMoneyText(value) {
      return value || "N/A";
    }
    function changeClass(m) {
      const txt = String(m?.pctChange || m?.netChange || "");
      if (txt.includes("-")) return "change-down";
      if (txt.includes("+")) return "change-up";
      return "";
    }
    function capText(value) {
      const n = Number(String(value || "").replace(/,/g, ""));
      if (!Number.isFinite(n) || n === 0) return value || "N/A";
      if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
      if (n >= 1e9) return "$" + (n / 1e9).toFixed(1) + "B";
      if (n >= 1e6) return "$" + (n / 1e6).toFixed(1) + "M";
      return "$" + n.toLocaleString();
    }
    function colorForLayer(layer) {
      return LAYER_COLORS[layer] || "#777";
    }
    function capital() {
      return Math.max(0, Number(document.getElementById("capitalInput").value || 0));
    }
    function mode() {
      return document.getElementById("shareMode").value;
    }
    function selectedPortfolio() {
      return PORTFOLIOS.find((p) => p.id === activePortfolio) || PORTFOLIOS[0];
    }
    function allocationRows(portfolio) {
      return Object.entries(portfolio.weights).map(([ticker, weight]) => {
        const security = byTicker[ticker];
        const market = MARKET[ticker] || {};
        const dollars = capital() * weight / 100;
        const price = Number(market.lastSale);
        const fractionalShares = Number.isFinite(price) && price > 0 ? dollars / price : null;
        const wholeShares = fractionalShares === null ? null : Math.floor(fractionalShares);
        const wholeCost = wholeShares === null ? null : wholeShares * price;
        const residualCash = wholeCost === null ? null : Math.max(0, dollars - wholeCost);
        return { ticker, weight, security, market, dollars, price, fractionalShares, wholeShares, residualCash };
      });
    }
    function renderTabs() {
      const tabs = document.getElementById("portfolioTabs");
      tabs.innerHTML = PORTFOLIOS.map((p) => '<button type="button" class="tab ' + (p.id === activePortfolio ? 'active' : '') + '" data-id="' + p.id + '"><b>' + p.name + '</b><span>' + p.risk + ' / ' + p.horizon + '</span></button>').join("");
      tabs.querySelectorAll(".tab").forEach((button) => {
        button.addEventListener("click", () => {
          activePortfolio = button.dataset.id;
          const firstTicker = Object.keys(selectedPortfolio().weights)[0];
          selectedTicker = firstTicker || selectedTicker;
          renderAll();
        });
      });
    }
    function layerExposure(rows) {
      const exposure = {};
      rows.forEach((row) => {
        const layer = row.security?.layer || "Other";
        exposure[layer] = (exposure[layer] || 0) + row.weight;
      });
      return Object.entries(exposure).sort((a, b) => b[1] - a[1]);
    }
    function renderPortfolio() {
      const p = selectedPortfolio();
      const rows = allocationRows(p);
      document.getElementById("portfolioName").textContent = p.name;
      document.getElementById("portfolioObjective").textContent = p.objective + " " + p.useCase;
      document.getElementById("portfolioRisk").textContent = p.risk + " risk / " + p.horizon;
      const wholeCash = rows.reduce((sum, r) => sum + (r.residualCash || 0), 0);
      const singleMax = Math.max(...rows.map((r) => r.weight));
      const chipExposure = rows.filter((r) => ["Compute silicon", "Custom silicon and networking", "Foundry and packaging", "Semiconductor equipment", "Memory and storage", "Chip design software", "Test equipment", "Power semiconductors"].includes(r.security?.layer)).reduce((sum, r) => sum + r.weight, 0);
      const powerExposure = rows.filter((r) => String(r.security?.layer || "").toLowerCase().includes("power") || String(r.security?.layer || "").toLowerCase().includes("grid") || r.ticker === "GRID").reduce((sum, r) => sum + r.weight, 0);
      document.getElementById("portfolioMetrics").innerHTML = [
        ["Capital", money(capital()), "Editable at top right"],
        ["Holdings", rows.length, "Single-name max " + pct(singleMax)],
        ["Chip Stack", pct(chipExposure), "Semis, EDA, memory, equipment"],
        ["Power Stack", pct(powerExposure), "Electricity, cooling, grid, generation"]
      ].map(([label, value, note]) => '<div class="metric"><span>' + label + '</span><b>' + value + '</b><small>' + note + '</small></div>').join("");
      document.getElementById("layerBars").innerHTML = layerExposure(rows).map(([layer, value]) => '<div class="bar-row"><span>' + layer + '</span><div class="bar-track"><div class="bar-fill" style="width:' + value + '%; background:' + colorForLayer(layer) + '"></div></div><b>' + pct(value) + '</b></div>').join("");
      document.getElementById("holdingsBody").innerHTML = rows.map((r) => {
        const displayShares = mode() === "whole" ? r.wholeShares : r.fractionalShares;
        return '<tr class="clickable ' + (r.ticker === selectedTicker ? 'selected' : '') + '" data-ticker="' + r.ticker + '">' +
          '<td><span class="ticker"><i class="dot" style="background:' + colorForLayer(r.security?.layer) + '"></i>' + r.ticker + '</span><div class="muted">' + (r.security?.name || "") + '</div></td>' +
          '<td>' + (r.security?.layer || "") + '</td>' +
          '<td class="num">' + pct(r.weight) + '</td>' +
          '<td class="num">' + money(r.dollars) + '</td>' +
          '<td class="num">' + money(r.price) + '<div class="' + changeClass(r.market) + '">' + (r.market?.pctChange || "") + '</div></td>' +
          '<td class="num">' + shares(displayShares) + '</td>' +
          '<td class="num">' + money(r.residualCash) + '</td>' +
        '</tr>';
      }).join("");
      document.querySelectorAll("#holdingsBody tr").forEach((row) => {
        row.addEventListener("click", () => {
          selectedTicker = row.dataset.ticker;
          renderAll(false);
        });
      });
    }
    function renderStackMap() {
      document.getElementById("stackMap").innerHTML = STACK.map((item) => '<div class="stack-cell"><b>' + item.title + '</b>' + item.names.map((ticker) => '<span>' + ticker + '</span>').join("") + '</div>').join("");
    }
    function renderLayerFilter() {
      const filter = document.getElementById("layerFilter");
      const layers = [...new Set(SECURITIES.map((s) => s.layer))].sort();
      const current = filter.value;
      filter.innerHTML = '<option value="">All layers</option>' + layers.map((layer) => '<option>' + layer + '</option>').join("");
      filter.value = current;
    }
    function renderCards() {
      const q = document.getElementById("searchInput").value.trim().toLowerCase();
      const layer = document.getElementById("layerFilter").value;
      const risk = document.getElementById("riskFilter").value;
      const cards = SECURITIES.filter((s) => {
        const haystack = [s.ticker, s.name, s.layer, s.role, s.thesis, s.risk].join(" ").toLowerCase();
        return (!q || haystack.includes(q)) && (!layer || s.layer === layer) && (!risk || s.risk === risk);
      });
      document.getElementById("securityCards").innerHTML = cards.map((s) => {
        const m = MARKET[s.ticker] || {};
        return '<article class="security-card ' + (s.ticker === selectedTicker ? 'selected' : '') + '" data-ticker="' + s.ticker + '">' +
          '<h3><i class="dot" style="background:' + colorForLayer(s.layer) + '"></i>' + s.ticker + ' <span class="muted">' + s.name + '</span></h3>' +
          '<div class="card-row"><span>' + s.layer + '</span><b>' + s.risk + '</b></div>' +
          '<div class="card-row"><span>Last</span><b>' + money(m.lastSale) + '</b></div>' +
          '<p>' + s.role + '</p>' +
        '</article>';
      }).join("");
      document.querySelectorAll(".security-card").forEach((card) => {
        card.addEventListener("click", () => {
          selectedTicker = card.dataset.ticker;
          renderAll(false);
        });
      });
    }
    function sourceLinks(keys) {
      return keys.map((key) => SOURCES[key]).filter(Boolean).map((source) => '<li><a href="' + source.url + '" target="_blank" rel="noreferrer">' + source.label + '</a><div class="muted">' + source.note + '</div></li>').join("");
    }
    function scoreMarkup(scores) {
      return scores.map((value, index) => '<div class="score-row"><span>' + scoreLabels[index] + '</span><div class="score-track">' + [1,2,3,4,5].map((n) => '<i class="' + (n <= value ? 'on' : '') + '"></i>').join("") + '</div><b>' + value + '</b></div>').join("");
    }
    function renderDetail() {
      const s = byTicker[selectedTicker] || SECURITIES[0];
      const m = MARKET[s.ticker] || {};
      const activeRows = allocationRows(selectedPortfolio());
      const allocation = activeRows.find((r) => r.ticker === s.ticker);
      const quoteUrl = s.assetClass === "etf" ? "https://www.nasdaq.com/market-activity/etf/" + s.ticker.toLowerCase() : "https://www.nasdaq.com/market-activity/stocks/" + s.ticker.toLowerCase();
      document.getElementById("detailPane").innerHTML =
        '<div class="detail-main">' +
          '<div class="detail-title">' +
            '<div>' +
              '<h2>' + s.ticker + ' ' + s.name + '</h2>' +
              '<div class="muted">' + s.layer + ' / ' + s.risk + ' risk</div>' +
            '</div>' +
            '<div class="price">' +
              '<b>' + money(m.lastSale) + '</b>' +
              '<span class="' + changeClass(m) + '">' + (m.netChange || "") + ' ' + (m.pctChange || "") + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="quote-grid">' +
            '<div class="quote-box"><span>Portfolio Weight</span><b>' + (allocation ? pct(allocation.weight) : "Watchlist") + '</b></div>' +
            '<div class="quote-box"><span>Allocation</span><b>' + (allocation ? money(allocation.dollars) : "Not in selected model") + '</b></div>' +
            '<div class="quote-box"><span>Shares</span><b>' + (allocation ? shares(mode() === "whole" ? allocation.wholeShares : allocation.fractionalShares) : "N/A") + '</b></div>' +
            '<div class="quote-box"><span>Trade Timestamp</span><b>' + (m.lastTradeTimestamp || "N/A") + '</b></div>' +
            '<div class="quote-box"><span>Market Cap</span><b>' + capText(m.marketCap) + '</b></div>' +
            '<div class="quote-box"><span>52 Week Range</span><b>' + (m.fiftyTwoWeekHighLow || "N/A") + '</b></div>' +
            '<div class="quote-box"><span>Volume</span><b>' + (m.volume || "N/A") + '</b></div>' +
            '<div class="quote-box"><span>1 Year Target</span><b>' + rawMoneyText(m.oneYearTarget) + '</b></div>' +
            '<div class="quote-box"><span>Dividend</span><b>' + rawMoneyText(m.annualizedDividend) + '</b></div>' +
            '<div class="quote-box"><span>Bid / Ask</span><b>' + rawMoneyText(m.bid) + ' / ' + rawMoneyText(m.ask) + '</b></div>' +
          '</div>' +
        '</div>' +
        '<div class="research-block"><h3>Role</h3><p>' + s.role + '</p></div>' +
        '<div class="research-block"><h3>Thesis</h3><p>' + s.thesis + '</p></div>' +
        '<div class="research-block"><h3>Bull Case</h3><ul>' + s.bull.map((x) => '<li>' + x + '</li>').join("") + '</ul></div>' +
        '<div class="research-block"><h3>Risks</h3><ul>' + s.risks.map((x) => '<li>' + x + '</li>').join("") + '</ul></div>' +
        '<div class="research-block"><h3>Watch Items</h3><ul>' + s.watch.map((x) => '<li>' + x + '</li>').join("") + '</ul></div>' +
        '<div class="research-block"><h3>Scores</h3><div class="scores">' + scoreMarkup(s.scores) + '</div></div>' +
        '<div class="research-block"><h3>Quote And Research Links</h3><ul>' +
          '<li><a href="' + quoteUrl + '" target="_blank" rel="noreferrer">Nasdaq quote page for ' + s.ticker + '</a><div class="muted">' + (m.error ? "API note: " + m.error : "Quote fields loaded into this local file.") + '</div></li>' +
          sourceLinks(s.sources) +
        '</ul></div>';
    }
    function exportCsv() {
      const p = selectedPortfolio();
      const rows = allocationRows(p);
      const csvRows = [["Portfolio", "Ticker", "Name", "Layer", "Weight", "Dollars", "LastPrice", "SharesFractional", "SharesWhole", "ResidualCash"]];
      rows.forEach((r) => csvRows.push([p.name, r.ticker, r.security?.name || "", r.security?.layer || "", r.weight, r.dollars.toFixed(2), r.price || "", r.fractionalShares || "", r.wholeShares || "", r.residualCash || ""]));
      const csv = csvRows.map((row) => row.map((cell) => '"' + String(cell).replaceAll('"', '""') + '"').join(",")).join("\\n");
      navigator.clipboard?.writeText(csv);
      const btn = document.getElementById("copyCsvBtn");
      btn.textContent = "CSV Copied";
      setTimeout(() => btn.textContent = "Export CSV", 1200);
    }
    function renderAll(rebuildTabs = true) {
      if (rebuildTabs) renderTabs();
      renderPortfolio();
      renderStackMap();
      renderLayerFilter();
      renderCards();
      renderDetail();
    }
    document.getElementById("capitalInput").addEventListener("input", () => renderAll(false));
    document.getElementById("shareMode").addEventListener("change", () => renderAll(false));
    document.getElementById("searchInput").addEventListener("input", () => renderAll(false));
    document.getElementById("layerFilter").addEventListener("change", () => renderAll(false));
    document.getElementById("riskFilter").addEventListener("change", () => renderAll(false));
    document.getElementById("copyCsvBtn").addEventListener("click", exportCsv);
    document.getElementById("resetBtn").addEventListener("click", () => {
      document.getElementById("capitalInput").value = 10000;
      document.getElementById("shareMode").value = "fractional";
      renderAll(false);
    });
    renderAll();
  </script>
</body>
</html>`;
}

async function main() {
  const market = {};
  for (const security of SECURITIES) {
    const raw = await fetchNasdaq(security.ticker, security.assetClass);
    market[security.ticker] = normalizeMarketData(raw, security);
    process.stdout.write(`${security.ticker} ${market[security.ticker].lastSaleText || "N/A"} ${market[security.ticker].lastTradeTimestamp || ""}\n`);
  }

  const data = {
    generatedAt: new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      dateStyle: "full",
      timeStyle: "long"
    }).format(new Date()),
    securities: SECURITIES,
    market
  };

  await fs.writeFile(OUTPUT, buildHtml(data), "utf8");
  process.stdout.write(`Wrote ${OUTPUT.pathname}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
