// TODO: move this to the protocol
export interface ContextProvider<T = unknown> {
  gather(): Promise<T>;
  canHandle(key: string): boolean;
}

// TODO: move this to the sdk package
class AppsContextProvider implements ContextProvider<Record<string, unknown>> {
  gather(): Promise<Record<string, unknown>> {
    return Promise.resolve({});
  }
  canHandle(key: string): boolean {
    return true;
  }
}

class SystemContextProvider implements ContextProvider<Record<string, unknown>> {
  gather(): Promise<Record<string, unknown>> {
    return Promise.resolve({});
  }
  canHandle(key: string): boolean {
    return true;
  }
}

export const context = {
  apps: new AppsContextProvider(),
  system: new SystemContextProvider(),
}

export const contextProviderSchema = z.object({
  gather: z.function().returns(z.promise(z.any())),
  canHandle: z.function().args(z.string()).returns(z.boolean()),
});

// TODO: move this to syner package
export function createContextProvider<T>(
  provider: ContextProvider<T>
): ContextProvider<T> {
  return contextProviderSchema.parse(provider) as ContextProvider<T>;
}