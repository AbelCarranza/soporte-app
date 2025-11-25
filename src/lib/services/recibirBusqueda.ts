import { buscarEnSheets } from '../services/sheets';

type Refs = {
    reportanteRef?: any;
    cpuForm?: any;
    perifericoRef?: any;
    cpuReplacementRef?: any;
    perifericoReplacementRef?: any;
};

const perifericoMap = {
    MonitorCode: ['bk_monitor', 'bk_mon_code', 'bk_mon_serial', 'MonitorBrand', 'MonitorCode', 'MonitorSerial'],
    KeyboardCode: ['bk_keyboard', 'bk_key_code', 'bk_key_serial', 'KeyboardBrand', 'KeyboardCode', 'KeyboardSerial'],
    MouseCode: ['bk_mouse', 'bk_mouse_code', 'bk_mouse_serial', 'MouseBrand', 'MouseCode', 'MouseSerial'],

    MonitorSerial: ['bk_monitor', 'bk_mon_code', 'bk_mon_serial', 'MonitorBrand', 'MonitorCode', 'MonitorSerial'],
    KeyboardSerial: ['bk_keyboard', 'bk_key_code', 'bk_key_serial', 'KeyboardBrand', 'KeyboardCode', 'KeyboardSerial'],
    MouseSerial: ['bk_mouse', 'bk_mouse_code', 'bk_mouse_serial', 'MouseBrand', 'MouseCode', 'MouseSerial'],
};

const perifericoMapForm = {
    MonitorCode: ['monitor_brand', 'monitor_code', 'monitor_serial', 'MonitorBrand', 'MonitorCode', 'MonitorSerial'],
    KeyboardCode: ['keyboard_brand', 'keyboard_code', 'keyboard_serial', 'KeyboardBrand', 'KeyboardCode', 'KeyboardSerial'],
    MouseCode: ['mouse_brand', 'mouse_code', 'mouse_serial', 'MouseBrand', 'MouseCode', 'MouseSerial'],

    MonitorSerial: ['monitor_brand', 'monitor_code', 'monitor_serial', 'MonitorBrand', 'MonitorCode', 'MonitorSerial'],
    KeyboardSerial: ['keyboard_brand', 'keyboard_code', 'keyboard_serial', 'KeyboardBrand', 'KeyboardCode', 'KeyboardSerial'],
    MouseSerial: ['mouse_brand', 'mouse_code', 'mouse_serial', 'MouseBrand', 'MouseCode', 'MouseSerial'],
};

function setPerifericoData(ref: any, eq: any, map: Record<string, string[]>) {
    const mapping = map[eq.matchField];
    if (!mapping) return;

    const [key1, key2, key3, brandField, codeField, serialField] = mapping;
    ref?.setData({
        [key1]: eq[brandField],
        [key2]: eq[codeField],
        [key3]: eq[serialField]
    });
}

export async function recibirBusquedaHandler(
    e: CustomEvent<{ tipo: string; codigo: string; form: string }>,
    refs: Refs
) {
    const { codigo, form, tipo } = e.detail;

    const data = await buscarEnSheets(form, codigo);
    if (!data || data.length === 0) return;

    const eq = data[0];

    refs.reportanteRef?.setData({ Location: eq.Location });

    if (tipo === '4') {
        if (eq.matchField === 'AssetCode' || eq.matchField === 'Serial') {
            refs.cpuReplacementRef?.setData(eq);
        } else {
            setPerifericoData(refs.perifericoReplacementRef, eq, perifericoMap);
        }
        return;
    }

    if (form === '1') {
        if (eq.matchField === 'AssetCode' || eq.matchField === 'Serial') {
            refs.cpuForm?.setData(eq);
        } else {
            setPerifericoData(refs.perifericoRef, eq, perifericoMapForm);
        }
        return;
    }
}
