# Benchmarks

`npm run benchmark` lints 250 clean and 250 intentionally invalid JavaScript modules with the public recommended preset. It fails if the clean corpus emits a diagnostic or the adversarial corpus is not rejected, and reports per-profile wall time, total CPU time, and heap growth. CI stores every scheduled result so a regression budget can be based on observed runner variance instead of an invented threshold.
