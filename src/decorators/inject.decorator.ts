import { PROVIDER_DEPENDENCIES } from "../meta/provider.meta";

export function Inject(token?: any): ParameterDecorator & PropertyDecorator {
  return function (target: Object, key: string | symbol, index?: number) {
    const deps =
      Reflect.getMetadata(PROVIDER_DEPENDENCIES, target.constructor) || [];

    token =
      token !== undefined
        ? token
        : index
        ? Reflect.getMetadata("design:paramtypes", target, key)[index]
        : Reflect.getMetadata("design:type", target, key);

    Reflect.defineMetadata(
      PROVIDER_DEPENDENCIES,
      deps.concat({
        key,
        index,
        token,
      }),
      typeof target === 'function' ? target : target.constructor
    );
  };
}
