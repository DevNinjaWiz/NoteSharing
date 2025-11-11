import {
  EmptyFeatureResult,
  Prettify,
  SignalStoreFeature,
  SignalStoreFeatureResult,
  StateSignals,
  WritableStateSource,
  getState,
  watchState,
  withHooks,
} from '@ngrx/signals';
import { EffectRef, effect } from '@angular/core';

export interface LoggerWatchConfig<T = unknown> {
  label?: string;
  source: () => T;
}

type LoggerStore<Input extends SignalStoreFeatureResult> = Prettify<
  StateSignals<Input['state']> &
    Input['props'] &
    Input['methods'] &
    WritableStateSource<Input['state']>
>;

/**
 * Logs every state transition of a Signal Store and optionally any extra signals.
 */
export function withLogger<Input extends SignalStoreFeatureResult>(
  label?: string,
  selectSignals?: Array<
    (store: LoggerStore<Input>) => LoggerWatchConfig | undefined
  >
): SignalStoreFeature<Input, EmptyFeatureResult> {
  return withHooks<Input>((store) => ({
    onInit() {
      const tag = label ?? store.constructor?.name ?? 'SignalStore';
      const stateSource = store as WritableStateSource<Input['state']>;

      let previousState = getState(stateSource);
      console.groupCollapsed(`[${tag}] state init`);
      console.log(previousState);
      console.groupEnd();

      const stateWatchRef = watchState(stateSource, (state) => {
        console.groupCollapsed(`[${tag}] state change`);
        console.log('previous:', previousState);
        console.log('next:', state);
        console.groupEnd();
        previousState = state;
      });

      const signalConfigs =
        selectSignals
          ?.map((select) => select(store))
          .filter(
            (config): config is LoggerWatchConfig => config !== undefined
          ) ?? [];

      const signalEffects: EffectRef[] = signalConfigs.map(
        ({ label: signalLabel, source }) => {
          let prevValue = source();
          console.groupCollapsed(
            `[${tag}] signal init${signalLabel ? `: ${signalLabel}` : ''}`
          );
          console.log(prevValue);
          console.groupEnd();

          return effect(() => {
            const nextValue = source();
            if (nextValue === prevValue) {
              return;
            }
            console.groupCollapsed(
              `[${tag}] signal change${signalLabel ? `: ${signalLabel}` : ''}`
            );
            console.log('previous:', prevValue);
            console.log('next:', nextValue);
            console.groupEnd();
            prevValue = nextValue;
          });
        }
      );

      return () => {
        stateWatchRef.destroy();
        signalEffects.forEach((ref) => ref.destroy());
      };
    },
  }));
}
