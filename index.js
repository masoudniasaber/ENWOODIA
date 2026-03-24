let data = {};
let currentSupplier = null;

// Load JSON
fetch('data.json')
    .then(res => res.json())
    .then(json => {
        data = json;
        loadSuppliers();
        loadFloorOptions();
        loadCeilingOptions();
    });

// Suppliers
function loadSuppliers() {
    const supplierSelect = document.getElementById('supplier');

    data.cltSuppliers.forEach((s, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = s.supplier;
        supplierSelect.appendChild(opt);
    });

    supplierSelect.addEventListener('change', () => {
        currentSupplier = data.cltSuppliers[supplierSelect.value];
        loadLayups();
    });

    supplierSelect.dispatchEvent(new Event('change'));
}

// Layups
function loadLayups() {
    const layupSelect = document.getElementById('layup');
    layupSelect.innerHTML = '';

    currentSupplier.layups.forEach((l, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = l.layup;
        layupSelect.appendChild(opt);
    });

    layupSelect.addEventListener('change', () => {
        const layup = currentSupplier.layups[layupSelect.value];
        showLayers(layup.layers);
        drawSketch(layup.layers);
    });

    layupSelect.dispatchEvent(new Event('change'));
}

// Floor options
function loadFloorOptions() {
    const floorSelect = document.getElementById('floor');

    data.floorOptions.forEach(f => {
        const opt = document.createElement('option');
        opt.textContent = f.name;
        floorSelect.appendChild(opt);
    });
}

// Ceiling options
function loadCeilingOptions() {
    const ceilingSelect = document.getElementById('ceiling');

    data.ceilingOptions.forEach(c => {
        const opt = document.createElement('option');
        opt.textContent = c.name;
        ceilingSelect.appendChild(opt);
    });
}

// Show layers text
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