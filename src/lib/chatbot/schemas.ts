import { stringify } from 'flatted';
import type { ChatStep } from './types';

// ─── Schema field definition ──────────────────────────────────────────────────
interface SchemaField {
  key: string;
  types: string[];
  required: boolean;
}

// ─── Per-step-type schemas ────────────────────────────────────────────────────
const COMMON_FIELDS: SchemaField[] = [
  { key: 'end',             types: ['boolean'],                    required: false },
  { key: 'placeholder',     types: ['string'],                     required: false },
  { key: 'hideInput',       types: ['boolean'],                    required: false },
  { key: 'hideExtraControl',types: ['boolean'],                    required: false },
  { key: 'inputAttributes', types: ['object'],                     required: false },
  { key: 'metadata',        types: ['object'],                     required: false },
];

const TRIGGER_FIELD: SchemaField =
  { key: 'trigger', types: ['string', 'number', 'function'], required: false };

const userSchema: SchemaField[] = [
  { key: 'id',        types: ['string', 'number'],              required: true  },
  { key: 'user',      types: ['boolean'],                       required: true  },
  { key: 'validator', types: ['function'],                      required: false },
  TRIGGER_FIELD,
  { key: 'hideExtraControl', types: ['boolean'],                required: false },
  { key: 'placeholder',      types: ['string'],                 required: false },
  { key: 'inputAttributes',  types: ['object'],                 required: false },
  { key: 'metadata',         types: ['object'],                 required: false },
  { key: 'end',              types: ['boolean'],                required: false },
];

const textSchema: SchemaField[] = [
  { key: 'id',      types: ['string', 'number'],              required: true  },
  { key: 'message', types: ['string', 'function'],            required: true  },
  { key: 'avatar',  types: ['string'],                        required: false },
  { key: 'delay',   types: ['number'],                        required: false },
  TRIGGER_FIELD,
  ...COMMON_FIELDS,
];

const optionsSchema: SchemaField[] = [
  { key: 'id',      types: ['string', 'number'], required: true  },
  { key: 'options', types: ['object'],           required: true  },
  ...COMMON_FIELDS,
];

const customSchema: SchemaField[] = [
  { key: 'id',        types: ['string', 'number'],              required: true  },
  { key: 'component', types: ['any'],                           required: true  },
  { key: 'avatar',    types: ['string'],                        required: false },
  { key: 'replace',   types: ['boolean'],                       required: false },
  { key: 'waitAction',types: ['boolean'],                       required: false },
  { key: 'asMessage', types: ['boolean'],                       required: false },
  { key: 'delay',     types: ['number'],                        required: false },
  TRIGGER_FIELD,
  ...COMMON_FIELDS,
];

const updateSchema: SchemaField[] = [
  { key: 'id',      types: ['string', 'number'],              required: true },
  { key: 'update',  types: ['string', 'number'],              required: true },
  { key: 'trigger', types: ['string', 'number', 'function'],  required: true },
  { key: 'placeholder',    types: ['string'], required: false },
  { key: 'inputAttributes',types: ['object'], required: false },
  { key: 'metadata',       types: ['object'], required: false },
];

// ─── Schema validator ─────────────────────────────────────────────────────────
const schema = {
  parse(step: ChatStep): ChatStep {
    let parser: SchemaField[];

    if (step.user)           parser = userSchema;
    else if (step.message)   parser = textSchema;
    else if (step.options)   parser = optionsSchema;
    else if (step.component) parser = customSchema;
    else if (step.update)    parser = updateSchema;
    else throw new Error(`The step ${stringify(step)} is invalid`);

    for (const { key, types, required } of parser) {
      const val = (step as Record<string, unknown>)[key];
      if (!val && required) {
        throw new Error(`Key '${key}' is required in step ${stringify(step)}`);
      }
      if (val && types[0] !== 'any' && !types.includes(typeof val)) {
        throw new Error(
          `The type of '${key}' must be ${types.join(' or ')} instead of ${typeof val}`
        );
      }
    }

    // Strip unknown keys
    const allowed = new Set(parser.map(p => p.key));
    for (const key of Object.keys(step)) {
      if (!allowed.has(key)) {
        console.error(`Invalid key '${key}' in step '${step.id}'`);
        delete (step as Record<string, unknown>)[key];
      }
    }

    return step;
  },

  checkInvalidIds(steps: Record<string, ChatStep>): void {
    for (const key of Object.keys(steps)) {
      const step = steps[key];
      const triggerId = step.trigger;

      if (typeof triggerId === 'function') continue;

      if (step.options) {
        for (const opt of step.options) {
          if (typeof opt.trigger === 'function') continue;
          if (opt.trigger && !steps[opt.trigger]) {
            throw new Error(
              `The id '${opt.trigger}' triggered by an option in step '${step.id}' does not exist`
            );
          }
        }
      } else if (triggerId && !steps[triggerId]) {
        throw new Error(
          `The id '${triggerId}' triggered by step '${step.id}' does not exist`
        );
      }
    }
  },
};

export default schema;
