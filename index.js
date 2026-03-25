let data = {};
let currentSupplier = null;

// Load data
fetch('data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        init();
    });

function init() {
    loadSuppliers();
    loadFloorOptions();
    loadCeilingOptions();
}

// Suppliers
function loadSuppliers() {
    const el = document.getElementById('supplier');

    data.cltSuppliers.forEach((s, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = s.supplier;
        el.appendChild(opt);
    });

    el.addEventListener('change', () => {
        currentSupplier = data.cltSuppliers[el.value];
        loadLayups();
        updateResults();
    });

    el.dispatchEvent(new Event('change'));
}

// Layups
function loadLayups() {
    const el = document.getElementById('layup');
    el.innerHTML = '';

    currentSupplier.layups.forEach((l, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = l.layup;
        el.appendChild(opt);
    });

    el.addEventListener('change', () => {
        const layup = currentSupplier.layups[el.value];
        showLayers(layup.layers);
        drawSketch(layup.layers);
        updateResults();
    });

    el.dispatchEvent(new Event('change'));
}

// Floor
function loadFloorOptions() {
    const el = document.getElementById('floor');

    data.floorOptions.forEach(f => {
        const opt = document.createElement('option');
        opt.textContent = f.name;
        el.appendChild(opt);
    });

    el.addEventListener('change', updateResults);
}

// Ceiling
function loadCeilingOptions() {
    const el = document.getElementById('ceiling');

    data.ceilingOptions.forEach(c => {
        const opt = document.createElement('option');
        opt.textContent = c.name;
        el.appendChild(opt);
    });

    el.addEventListener('change', updateResults);
}

// Show layers
function showLayers(layers) {
    const div = document.getElementById('layers');
    div.innerHTML = '<h3>Layers</h3>';

    layers.forEach((l, i) => {
        const p = document.createElement('p');
        p.textContent = `Layer ${i + 1}: ${l.thickness_mm} mm ${l.E_GPa ? '- E: ' + l.E_GPa + ' GPa' : ''}`;
        div.appendChild(p);
    });
}

// Draw sketch
function drawSketch(layers) {
    const sketch = document.getElementById('sketch');
    sketch.innerHTML = '';

    layers.forEach(l => {
        const block = document.createElement('div');
        block.className = 'layer-block';
        block.style.height = l.thickness_mm + 'px';
        block.textContent = l.thickness_mm + ' mm';
        sketch.appendChild(block);
    });
}

// 🔥 Results logic
function updateResults() {
    if (!currentSupplier) return;

    const supplier = currentSupplier.supplier;
    const layup = document.getElementById('layup').selectedOptions[0].textContent;
    const floor = document.getElementById('floor').value;
    const ceiling = document.getElementById('ceiling').value;

    const result = data.results.find(r =>
        r.supplier === supplier &&
        r.layup === layup &&
        r.floor === floor &&
        r.ceiling === ceiling
    );

    if (result) {
        document.getElementById('stc').textContent = `STC: ${result.stc}`;
        document.getElementById('rw').textContent = `Rw: ${result.rw}`;
        document.getElementById('iic').textContent = `IIC: ${result.iic}`;
        document.getElementById('lnw').textContent = `Ln,w: ${result.lnw}`;
        document.getElementById('thickness').textContent = `Thickness: ${result.thickness_mm} mm`;
    } else {
        document.getElementById('stc').textContent = 'No data';
        document.getElementById('rw').textContent = '';
        document.getElementById('iic').textContent = '';
        document.getElementById('lnw').textContent = '';
        document.getElementById('thickness').textContent = '';
    }
}