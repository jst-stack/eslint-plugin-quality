# Benchmarks

`npm run benchmark` lints 500 independent JavaScript modules with the public recommended preset and reports wall time, CPU time, and heap growth. CI stores every scheduled result so a proposed regression budget can be based on observed runner variance instead of an invented threshold.
