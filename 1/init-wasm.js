// Patch querySelector
Document.prototype.querySelector = ((orig) => function(selector) {
    return selector === '!parent' ? 
        (document.getElementById('notparent') || 
         (() => { const d = document.createElement('div'); d.id = 'notparent'; document.body.appendChild(d); return d; })())
        : orig.call(this, selector);
})(Document.prototype.querySelector);

class WasmInitializer {
    constructor({ wasmPath, jsRuntimePath } = {}) {
        this.wasmPath = wasmPath;
        this.jsRuntimePath = jsRuntimePath;
    }
    async init() {
        const wasmBuffer = await fetch(this.wasmPath).then(response => response.arrayBuffer());
        const script = document.createElement('script');
        script.src = this.jsRuntimePath;
        script.onload = () => {
            window.EJS_Runtime({
                noInitialRun: true,
                canvas: document.querySelector('canvas'),
                locateFile: file => file.endsWith('.wasm') ? 
                    URL.createObjectURL(new Blob([wasmBuffer], { type: 'application/wasm' })) : file
            }).then(module => {
                this.Module = window.Module = module;
                window.EM_FS = module.FS;
            });
        };
        document.body.appendChild(script);
    }
}