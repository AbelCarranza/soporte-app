import { notifyError } from '../services/notyf';

const allowedRegex = /^[A-Za-z0-9\- ]+$/;

type FieldMap = {
  monitor: {
    brand: string;
    code: string;
    serial: string;
  };
  keyboard: {
    brand: string;
    code: string;
    serial: string;
  };
  mouse: {
    brand: string;
    code: string;
    serial: string;
  };
  observations: string;
};

type ShowMap = {
  monitor: boolean;
  keyboard: boolean;
  mouse: boolean;
};

export function validatePerifericos(
  data: any,
  fields: FieldMap,
  show: ShowMap
): boolean {

  if (show.monitor) {
    if (!validateFields(
      {
        brand: data[fields.monitor.brand],
        code: data[fields.monitor.code],
        serial: data[fields.monitor.serial]
      },
      'Monitor'
    )) return false;
  }

  if (show.keyboard) {
    if (!validateFields(
      {
        brand: data[fields.keyboard.brand],
        code: data[fields.keyboard.code],
        serial: data[fields.keyboard.serial]
      },
      'Teclado'
    )) return false;
  }

  if (show.mouse) {
    if (!validateFields(
      {
        brand: data[fields.mouse.brand],
        code: data[fields.mouse.code],
        serial: data[fields.mouse.serial]
      },
      'Mouse'
    )) return false;
  }

  if (fields.observations) {
    data[fields.observations] = String(data[fields.observations] ?? '').trim();
  }

  return true;
}

function validateFields(fields: any, sectionName: string): boolean {
  const labels: any = {
    brand: 'Marca y/o Modelo',
    code: 'Código',
    serial: 'Número de Serie'
  };

  for (const [key, value] of Object.entries(fields)) {
    const trimmed = String(value ?? '').trim();

    if (!trimmed) {
      notifyError(`El campo "${sectionName} - ${labels[key]}" debe estar completo.`);
      return false;
    }

    if (!allowedRegex.test(trimmed)) {
      notifyError(`"${sectionName} - ${labels[key]}" contiene caracteres inválidos.`);
      return false;
    }
  }

  return true;
}
