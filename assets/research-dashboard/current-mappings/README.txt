Current retained mapping sweep — frozen 2026-10-05

Requested scope: chiplets4/8/16/32/64 x cores per chiplet1/4/16.
Batch1,8 channels per directional port,8B/cycle allocation quantum.
886 retained distinct mappings across255 config/workload pairs.
315 paired capacity designs:17 workloads +CNN/RNN/Transformer/ALL17 for each15configs.
Include workloads with1/2 mappings; no waiting for further mapping discovery.

Every reported design supports ALL retained mappings of its workload or group.
Workloads/mappings execute separately. A group/ALL design uses one shared template
set and one shared orientation layout, not an average of individual designs.
Mapping eligibility and sizing deadline: floor(frozen original reference*1001/1000).
References are config/workload specific. Cross-config capacity plots use each
config's own Baseline2 denominator; this is not a fixed-total-compute sweep.
Original ongoing mapping searches are unchanged by this report.

B1: uniform four-port chiplet, including unused exterior-facing TX/RX ports.
B2: uniform A/H/I corner/edge/interior port masks, omitting exterior-facing ports.
Both use the same minimum uniform bandwidth that meets all selected deadlines.
For h x w mesh, C=h*w, ch=8 and uniform per-channel u:
B1=C*4*2*ch*u; B2=(2*h*(w-1)+2*w*(h-1))*2*ch*u.
Proposed: independently sized TX/RX per direction/channel,8B/cycle quantum.
Rotation+reflection is initialized from rotation-only to avoid a worse solution.
Small certified cases use exact search; large orientation search is heuristic.
Mirrors are assumed free of additional implementation/template cost. Area policy
permits hypothetical area-exceeded mappings. Capacity reduction is not speedup.

Frozen full native mappings are replayed. New capacities are checked by independent
endpoint accounting and scalar/sparse schedule replay, not fresh native simulation
for every capacity assignment. VALIDATION.json and mapping-timing-checks.csv record
per-mapping acceptance. Native input audit covers all886 retained mappings.
120 prior paired results were reused only after exact mapping-ID set, config,
and original timing-limit matches; reused_from is recorded in manifest.json.

Collection policy: retain up to5 profiles per workload under directional capacity
normalized L1 >=0.05 after removing topology-preserving rotations. Focus16/32/64
uses exact IDs from COLLECTION-SNAPSHOT.json;4/8 uses the same ordered source union
and distance predicate. "All mappings" means this curated distinct collection,
not every raw candidate encountered during historical search.

plot-baseline2.csv contains Baseline1/Baseline2, Rotation/Baseline2, and
RotationReflection/Baseline2; Baseline2=1.0. comparison-all.csv includes absolute
capacity, both denominator choices, and percent reductions. plot-long.csv is tidy.
Group/ALL rows are shared optimizations, not arithmetic or geometric means.
Native input audit, fixed-parameters.csv, sweep-configs.csv, and paper-config-table.tex
provide the manuscript settings with source evidence and derived resource counts.

site-output/current-mappings.html is the new page in the existing research dashboard.
Its traffic viewer covers every retained mapping, including newly collected ones.
Routed bytes sum saved layer-node volumes across8channels; all-layer values sum
leaf-layer routed volumes at batch1, including DRAM-routed mesh traffic. They are
byte-hops, not direct source-destination payloads. Capacity-profile and provisioned
bandwidth views are separately labeled. Layer filtering and mesh SVG downloads are
available. Per-workload/group charts export PNG/SVG and a21-page PDF.
The NEW badge compares mapping IDs with the preceding public batch1/ch8 catalog.

Reproduction: python3 run.py (resumes completed pairs); python3 export.py;
python3 build-site.py; node verify-site.js. All paths refer to frozen study inputs.
Future discoveries are not silently added to this snapshot.

Replay acceleration: new workers may use compiled_sparse.py/replay_kernel.cpp,
an exact integer implementation of the same SparseFast recurrence. All886 mappings
passed3544 comparisons, including independent scalar replay; optimization search
starts/seeds/constraints are unchanged. Existing workers were not interrupted.
Build with: g++ -O3 -std=c++17 -fPIC -shared replay_kernel.cpp -o replay_kernel.so
See COMPILED-REPLAY-VALIDATION.json and REPLAY-BACKEND.json.

Final three c64-core1 shared reflection cases use sizing_pruned.py, a copy of the
same optimizer that rejects candidates violating existing necessary per-node
bandwidth lower bounds before full replay. Passing bounds still needs replay.
Three-start seeds/order are unchanged. PRUNING-VALIDATION.json records3622 feasible
checks and585 scalar-condition violations; a complete control search reproduced
templates,orientations,bandwidth,counts,timing checks,queries,and all3starts exactly.
The three final replacements independently passed endpoint and scalar replay.
PRUNING-INSTALL.json identifies their preserved accelerated source folders.
